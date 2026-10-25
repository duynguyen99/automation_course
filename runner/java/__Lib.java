import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 * Helpers available to a lesson's hidden checks (the generated __Checks class extends this).
 * Everything goes through reflection so a missing method fails a check instead of the compile.
 */
public class __Lib {
    static String output = "";
    static boolean crashed = false;

    public interface Probe { Object get() throws Throwable; }

    /** The learner's console output with normalized line endings. */
    static String out() { return output.replace("\r\n", "\n"); }

    static List<String> lines() {
        List<String> result = new ArrayList<>();
        for (String line : out().split("\n")) {
            if (!line.isBlank()) result.add(line.strip());
        }
        return result;
    }

    static void check(String id, boolean pass, String hint) {
        String safeHint = hint == null ? "" : hint.replace('\n', ' ').replace('|', '/');
        // Leading newline: learner code called by a check may have printed without one.
        System.out.println("\n##CHECK|" + id + "|" + (pass ? "PASS" : "FAIL") + "|" + safeHint);
    }

    /** Passes when probe returns Boolean.TRUE. */
    static void ok(String id, Probe probe, String hint) {
        try {
            Object value = probe.get();
            check(id, Boolean.TRUE.equals(value), hint);
        } catch (Throwable t) {
            check(id, false, explain(t));
        }
    }

    /** Passes when the probe's value equals expected (numbers compared by value, arrays by content). */
    static void eq(String id, Probe probe, Object expected, String label) {
        try {
            Object actual = probe.get();
            boolean pass = same(actual, expected);
            check(id, pass, pass ? "" : label + " trả về " + show(actual) + ", nhưng mong đợi " + show(expected));
        } catch (Throwable t) {
            check(id, false, label + ": " + explain(t));
        }
    }

    /** Calls a static method of class Main by name and argument count. */
    static Object call(String name, Object... args) throws Throwable {
        return invokeStatic("Main", name, args);
    }

    static Object invokeStatic(String className, String name, Object... args) throws Throwable {
        Class<?> cls = Class.forName(className);
        for (Method m : cls.getDeclaredMethods()) {
            if (!m.getName().equals(name) || m.getParameterCount() != args.length) continue;
            if (!Modifier.isStatic(m.getModifiers())) {
                throw new MissingException("Method " + name + " cần có từ khóa static");
            }
            m.setAccessible(true);
            try {
                return m.invoke(null, args);
            } catch (IllegalArgumentException e) {
                continue; // parameter types did not match, try another overload
            } catch (InvocationTargetException e) {
                throw e.getCause();
            }
        }
        throw new MissingException("Không tìm thấy method " + name + " với " + args.length
                + " tham số trong class " + className);
    }

    // ---------- OOP helpers: everything by name so a missing class fails a check, not the compile ----------

    static Class<?> cls(String name) throws MissingException {
        try {
            return Class.forName(name);
        } catch (ClassNotFoundException e) {
            throw new MissingException("Chưa có class " + name);
        }
    }

    static boolean hasClass(String name) {
        try {
            Class.forName(name);
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }

    /** new ClassName(args...) using the constructor with a matching parameter count. */
    static Object newObj(String className, Object... args) throws Throwable {
        Class<?> c = cls(className);
        for (java.lang.reflect.Constructor<?> ctor : c.getDeclaredConstructors()) {
            if (ctor.getParameterCount() != args.length) continue;
            ctor.setAccessible(true);
            try {
                return ctor.newInstance(args);
            } catch (IllegalArgumentException e) {
                continue;
            } catch (InvocationTargetException e) {
                throw e.getCause();
            }
        }
        throw new MissingException("Class " + className + " chưa có constructor nhận " + args.length + " tham số");
    }

    /** obj.method(args...) — searches the class and its parents (so inherited/overridden methods work). */
    static Object callOn(Object target, String name, Object... args) throws Throwable {
        if (target == null) throw new MissingException("Đối tượng đang là null");
        for (Class<?> c = target.getClass(); c != null; c = c.getSuperclass()) {
            for (Method m : c.getDeclaredMethods()) {
                if (!m.getName().equals(name) || m.getParameterCount() != args.length) continue;
                m.setAccessible(true);
                try {
                    return m.invoke(target, args);
                } catch (IllegalArgumentException e) {
                    continue;
                } catch (InvocationTargetException e) {
                    throw e.getCause();
                }
            }
        }
        throw new MissingException("Class " + target.getClass().getSimpleName() + " chưa có method " + name
                + " với " + args.length + " tham số");
    }

    /** Value of a field (private too), looked up through parent classes. */
    static Object field(Object target, String name) throws Throwable {
        for (Class<?> c = target.getClass(); c != null; c = c.getSuperclass()) {
            try {
                java.lang.reflect.Field f = c.getDeclaredField(name);
                f.setAccessible(true);
                return f.get(target);
            } catch (NoSuchFieldException ignored) { }
        }
        throw new MissingException("Class " + target.getClass().getSimpleName() + " chưa có thuộc tính " + name);
    }

    static boolean fieldIsPrivate(String className, String fieldName) throws Throwable {
        try {
            return Modifier.isPrivate(cls(className).getDeclaredField(fieldName).getModifiers());
        } catch (NoSuchFieldException e) {
            throw new MissingException("Class " + className + " chưa có thuộc tính " + fieldName);
        }
    }

    static boolean extendsClass(String child, String parent) throws Throwable {
        return cls(parent).isAssignableFrom(cls(child)) && !child.equals(parent);
    }

    static boolean isInterface(String name) throws Throwable {
        return cls(name).isInterface();
    }

    static boolean isAbstract(String name) throws Throwable {
        return Modifier.isAbstract(cls(name).getModifiers());
    }

    /** Runs code that must throw; passes when it throws an exception of the given simple class name. */
    static void throwsEx(String id, Probe probe, String exceptionSimpleName, String label) {
        try {
            probe.get();
            check(id, false, label + " không ném ra exception nào, nhưng mong đợi " + exceptionSimpleName);
        } catch (MissingException e) {
            check(id, false, e.getMessage());
        } catch (Throwable t) {
            boolean pass = false;
            for (Class<?> c = t.getClass(); c != null; c = c.getSuperclass()) {
                if (c.getSimpleName().equals(exceptionSimpleName)) pass = true;
            }
            check(id, pass, pass ? "" : label + " ném ra " + t.getClass().getSimpleName() + ", nhưng mong đợi " + exceptionSimpleName);
        }
    }

    static boolean hasStaticMethod(String name, int paramCount) {
        try {
            for (Method m : Class.forName("Main").getDeclaredMethods()) {
                if (m.getName().equals(name) && m.getParameterCount() == paramCount
                        && Modifier.isStatic(m.getModifiers())) return true;
            }
        } catch (ClassNotFoundException ignored) { }
        return false;
    }

    static boolean same(Object a, Object b) {
        if (a instanceof Number x && b instanceof Number y) {
            return Math.abs(x.doubleValue() - y.doubleValue()) < 1e-9;
        }
        if (a != null && b != null && a.getClass().isArray() && b.getClass().isArray()) {
            return Arrays.deepEquals(toObjects(a), toObjects(b));
        }
        return Objects.equals(a, b);
    }

    static Object[] toObjects(Object array) {
        int n = Array.getLength(array);
        Object[] result = new Object[n];
        for (int i = 0; i < n; i++) result[i] = Array.get(array, i);
        return result;
    }

    static String show(Object v) {
        if (v == null) return "null";
        if (v instanceof String s) return "\"" + s + "\"";
        if (v instanceof Character c) return "'" + c + "'";
        if (v.getClass().isArray()) return Arrays.deepToString(toObjects(v));
        return String.valueOf(v);
    }

    static String explain(Throwable t) {
        if (t instanceof MissingException) return t.getMessage();
        return "code bị lỗi khi chạy: " + t;
    }

    static class MissingException extends RuntimeException {
        MissingException(String message) { super(message); }
    }
}
