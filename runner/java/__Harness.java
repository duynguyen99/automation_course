import java.io.ByteArrayOutputStream;
import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;

/**
 * Entry point used by the runner. It runs the learner's Main.main, mirrors its
 * output to the real stdout while capturing a copy, then runs the hidden checks.
 */
public class __Harness {
    static final String CHECKS_MARKER = "\u001e##CHECKS";

    public static void main(String[] args) {
        PrintStream real = new PrintStream(new FileOutputStream(FileDescriptor.out), true, StandardCharsets.UTF_8);
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        PrintStream tee = new PrintStream(new OutputStream() {
            @Override public void write(int b) { real.write(b); captured.write(b); }
            @Override public void write(byte[] b, int off, int len) { real.write(b, off, len); captured.write(b, off, len); }
            @Override public void flush() { real.flush(); }
        }, true, StandardCharsets.UTF_8);

        System.setOut(tee);
        boolean crashed = runLearnerMain();
        System.out.flush();
        System.setOut(real);

        __Lib.output = captured.toString(StandardCharsets.UTF_8);
        __Lib.crashed = crashed;
        real.println();
        real.println(CHECKS_MARKER);
        try {
            Class.forName("__Checks").getDeclaredMethod("run").invoke(null);
        } catch (InvocationTargetException e) {
            real.println("##CHECK_ERROR|" + e.getCause());
        } catch (ReflectiveOperationException e) {
            real.println("##CHECK_ERROR|" + e);
        }
        real.flush();
        System.exit(0);
    }

    private static boolean runLearnerMain() {
        Method main;
        try {
            main = Class.forName("Main").getMethod("main", String[].class);
        } catch (ClassNotFoundException e) {
            System.err.println("##NO_MAIN_CLASS");
            return true;
        } catch (NoSuchMethodException e) {
            System.err.println("##NO_MAIN_METHOD"); // informational: checks still run
            return false;
        }
        try {
            main.invoke(null, (Object) new String[0]);
            return false;
        } catch (InvocationTargetException e) {
            printLearnerStackTrace(e.getCause());
            return true;
        } catch (IllegalAccessException e) {
            System.err.println("##MAIN_NOT_PUBLIC");
            System.err.flush();
            return true;
        }
    }

    /** Prints the exception like the JVM would, hiding reflection and harness frames. */
    private static void printLearnerStackTrace(Throwable t) {
        StringBuilder sb = new StringBuilder("Exception in thread \"main\" ").append(t).append('\n');
        for (StackTraceElement el : t.getStackTrace()) {
            String cls = el.getClassName();
            if (cls.startsWith("java.") || cls.startsWith("jdk.") || cls.startsWith("__")) continue;
            sb.append("\tat ").append(el).append('\n');
        }
        System.err.print(sb);
        System.err.flush();
    }
}
