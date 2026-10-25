import type { FriendlyError, RunnerResult } from "./types";

interface Rule {
  match: RegExp;
  explain: (m: RegExpMatchArray) => Omit<FriendlyError, "line">;
}

const COMPILE_RULES: Rule[] = [
  {
    match: /^';' expected/,
    explain: () => ({
      title: "Thiếu dấu chấm phẩy ;",
      detail: "Trong Java, mỗi câu lệnh phải kết thúc bằng dấu ; giống như dấu chấm cuối câu. Hãy thêm ; ở cuối dòng được chỉ ra (hoặc dòng ngay phía trên).",
    }),
  },
  {
    match: /^cannot find symbol/,
    explain: () => ({
      title: "Java không tìm thấy tên này (cannot find symbol)",
      detail: "Thường do gõ sai chính tả, sai chữ HOA/thường (Java phân biệt String và string), hoặc dùng biến trước khi khai báo.",
    }),
  },
  {
    match: /^incompatible types: (.+) cannot be converted to (.+)/,
    explain: (m) => ({
      title: "Sai kiểu dữ liệu (incompatible types)",
      detail: `Bạn đang đưa một giá trị kiểu ${m[1]} vào chỗ cần kiểu ${m[2]}. Ví dụ: không thể gán "5" (String) cho biến int.`,
    }),
  },
  {
    match: /^incompatible types: possible lossy conversion from (\w+) to (\w+)/,
    explain: (m) => ({
      title: "Có thể mất dữ liệu khi đổi kiểu",
      detail: `Đổi từ ${m[1]} sang ${m[2]} có thể làm mất phần thập phân hoặc giá trị lớn, nên Java không tự đổi. Hãy dùng đúng kiểu, hoặc ép kiểu rõ ràng như (${m[2]}) giaTri.`,
    }),
  },
  {
    match: /^unclosed string literal/,
    explain: () => ({
      title: 'Chuỗi chưa được đóng bằng dấu "',
      detail: 'Một chuỗi phải nằm giữa hai dấu ngoặc kép, ví dụ "Xin chào". Kiểm tra xem bạn có quên dấu " ở cuối không.',
    }),
  },
  {
    match: /^reached end of file while parsing/,
    explain: () => ({
      title: "Thiếu dấu ngoặc nhọn đóng }",
      detail: "Java đọc đến cuối file mà vẫn còn khối { chưa được đóng. Mỗi dấu { cần có một dấu } tương ứng.",
    }),
  },
  {
    match: /^class, interface, enum, or record expected/,
    explain: () => ({
      title: "Có code nằm ngoài class",
      detail: "Thường là do thừa một dấu }, khiến phần code phía sau bị rơi ra ngoài class. Hãy đếm lại các cặp { }.",
    }),
  },
  {
    match: /^missing return statement/,
    explain: () => ({
      title: "Thiếu câu lệnh return",
      detail: "Method có kiểu trả về (không phải void) thì mọi nhánh đều phải return một giá trị.",
    }),
  },
  {
    match: /^variable (\w+) might not have been initialized/,
    explain: (m) => ({
      title: `Biến ${m[1]} chưa có giá trị`,
      detail: `Bạn đã khai báo ${m[1]} nhưng chưa gán giá trị trước khi dùng. Hãy gán giá trị ban đầu, ví dụ: int ${m[1]} = 0;`,
    }),
  },
  {
    match: /^variable (\w+) is already defined/,
    explain: (m) => ({
      title: `Biến ${m[1]} bị khai báo hai lần`,
      detail: `Trong cùng một khối code, mỗi tên biến chỉ khai báo một lần. Lần sau chỉ cần gán lại: ${m[1]} = ...;`,
    }),
  },
  {
    match: /^not a statement/,
    explain: () => ({
      title: "Đây không phải câu lệnh hợp lệ",
      detail: "Dòng này có một giá trị đứng một mình mà không làm gì cả. Có thể bạn quên dấu = hoặc gõ thừa ký tự.",
    }),
  },
  {
    match: /^class (\w+) is public, should be declared in a file named/,
    explain: (m) => ({
      title: "Tên class phải trùng tên file",
      detail: `Class public phải có tên giống hệt tên file (ví dụ file Main.java thì class là Main). Bạn đang đặt là ${m[1]}.`,
    }),
  },
  {
    match: /^'\)' expected|^'\(' expected|^'\]' expected/,
    explain: () => ({
      title: "Thiếu dấu ngoặc",
      detail: "Các dấu ( ) và [ ] luôn đi thành cặp. Kiểm tra xem bạn có mở ngoặc mà quên đóng không.",
    }),
  },
  {
    match: /^illegal start of expression/,
    explain: () => ({
      title: "Câu lệnh bắt đầu không hợp lệ",
      detail: "Thường do thiếu dấu } của khối phía trên, hoặc viết code (ví dụ khai báo method) ở chỗ không được phép.",
    }),
  },
  {
    match: /^bad operand types for binary operator '(.+)'/,
    explain: (m) => ({
      title: `Không dùng được phép ${m[1]} với hai kiểu dữ liệu này`,
      detail: "Ví dụ: không thể dùng && với số, hay so sánh String bằng < >. Kiểm tra lại kiểu của hai vế.",
    }),
  },
];

const RUNTIME_RULES: Rule[] = [
  {
    match: /ArithmeticException: \/ by zero/,
    explain: () => ({ title: "Chia cho 0", detail: "Trong Java, chia một số nguyên cho 0 sẽ làm chương trình dừng lại." }),
  },
  {
    match: /ArrayIndexOutOfBoundsException: Index (-?\d+) out of bounds for length (\d+)/,
    explain: (m) => ({
      title: "Truy cập ngoài phạm vi mảng",
      detail: `Bạn lấy phần tử thứ ${m[1]} nhưng mảng chỉ có ${m[2]} phần tử (chỉ số đi từ 0 đến ${Number(m[2]) - 1}).`,
    }),
  },
  {
    match: /StringIndexOutOfBoundsException/,
    explain: () => ({ title: "Vị trí ký tự không tồn tại", detail: "Vị trí trong chuỗi bắt đầu từ 0 và nhỏ hơn length()." }),
  },
  {
    match: /NullPointerException/,
    explain: () => ({
      title: "Dùng một biến đang là null (NullPointerException)",
      detail: "Biến chưa trỏ tới đối tượng nào mà bạn đã gọi method trên nó. Đây cũng là lỗi tester gặp rất nhiều khi automation!",
    }),
  },
  {
    match: /NumberFormatException: For input string: "(.*)"/,
    explain: (m) => ({ title: "Không đổi được chuỗi thành số", detail: `Chuỗi "${m[1]}" không phải là một con số hợp lệ.` }),
  },
  {
    match: /InputMismatchException|NoSuchElementException/,
    explain: () => ({ title: "Dữ liệu nhập vào không khớp", detail: "Scanner đang chờ một kiểu dữ liệu khác, hoặc không còn dữ liệu để đọc." }),
  },
  {
    match: /StackOverflowError/,
    explain: () => ({ title: "Method gọi chính nó mãi không dừng", detail: "Hãy kiểm tra điều kiện dừng của method đệ quy." }),
  },
];

function firstRule(rules: Rule[], text: string): Omit<FriendlyError, "line"> | null {
  for (const rule of rules) {
    const m = text.match(rule.match);
    if (m) return rule.explain(m);
  }
  return null;
}

const SELENIUM_RULES: Rule[] = [
  {
    match: /NoSuchElementException/,
    explain: () => ({
      title: "Không tìm thấy phần tử (NoSuchElementException)",
      detail: "Locator không khớp phần tử nào trên trang, hoặc phần tử chưa kịp xuất hiện. Kiểm tra lại locator bằng DevTools, hoặc dùng explicit wait.",
    }),
  },
  {
    match: /TimeoutException/,
    explain: () => ({
      title: "Chờ quá thời gian (TimeoutException)",
      detail: "Điều kiện bạn chờ không xảy ra trong thời gian cho phép. Locator có đúng không? Thời gian chờ đã đủ chưa?",
    }),
  },
  {
    match: /StaleElementReferenceException/,
    explain: () => ({
      title: "Phần tử đã cũ (StaleElementReferenceException)",
      detail: "Trang đã thay đổi sau khi bạn tìm phần tử. Hãy tìm lại phần tử ngay trước khi dùng.",
    }),
  },
  {
    match: /ElementClickInterceptedException/,
    explain: () => ({
      title: "Có thứ khác che mất phần tử",
      detail: "Một phần tử khác (popup, spinner...) đang nằm đè lên chỗ bạn muốn click. Chờ nó biến mất rồi click lại.",
    }),
  },
  {
    match: /ElementNotInteractableException/,
    explain: () => ({
      title: "Phần tử chưa thao tác được",
      detail: "Phần tử có trên trang nhưng đang ẩn hoặc bị vô hiệu hóa. Chờ cho nó hiện ra (visibilityOf / elementToBeClickable).",
    }),
  },
  {
    match: /NoAlertPresentException/,
    explain: () => ({ title: "Không có hộp thoại nào", detail: "Bạn chuyển sang alert khi nó chưa xuất hiện." }),
  },
  {
    match: /NoSuchFrameException|NoSuchWindowException/,
    explain: () => ({ title: "Không tìm thấy frame/cửa sổ", detail: "Kiểm tra lại id/tên của iframe hoặc handle của cửa sổ." }),
  },
  {
    match: /SessionNotCreatedException|cannot find Chrome binary/,
    explain: () => ({ title: "Không mở được Chrome", detail: "Máy chạy code chưa có Chrome phù hợp. Lỗi này không phải do bạn." }),
  },
];

/** Selenium failures can appear as runtime errors or inside failed JUnit/Cucumber tests. */
function explainSelenium(run: RunnerResult): FriendlyError | null {
  const text = [run.stderr, ...(run.tests ?? []).map((t) => t.message ?? ""), ...(run.scenarios ?? []).flatMap((s) => s.steps.map((st) => st.error ?? ""))].join("\n");
  const known = firstRule(SELENIUM_RULES, text);
  return known ? { ...known } : null;
}

/** Turns runner output into short Vietnamese explanations a beginner can act on. */
export function explainErrors(run: RunnerResult): FriendlyError[] {
  if (run.status === "timeout") {
    return [{
      title: "Chương trình chạy quá lâu",
      detail: "Có thể có vòng lặp không bao giờ dừng. Kiểm tra lại điều kiện của while/for.",
    }];
  }
  if (run.status === "compile_error") {
    if (run.internalError) {
      return [{ title: "Bài học đang lỗi", detail: "Lỗi này không phải do bạn. Hãy báo lại cho người soạn bài nhé." }];
    }
    const seen = new Set<string>();
    return run.diagnostics
      .filter((d) => !d.file.split("/").pop()!.startsWith("__") && d.severity === "error")
      .map((d) => {
        const known = firstRule(COMPILE_RULES, d.message);
        return { ...(known ?? { title: "Lỗi biên dịch", detail: d.message }), file: d.file, line: d.line };
      })
      .filter((e) => {
        const key = `${e.title}@${e.file}:${e.line}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3);
  }
  if (run.truncated) {
    return [{
      title: "Chương trình in ra quá nhiều",
      detail: "Output quá dài nên bị cắt bớt. Có thể một vòng lặp đang in ra quá nhiều lần.",
    }];
  }
  if (run.status === "runtime_error") {
    if (run.stderr.includes("##NO_MAIN_CLASS")) {
      return [{ title: "Không tìm thấy class Main", detail: "Code của bạn cần có public class Main." }];
    }
    if (run.stderr.includes("##MAIN_NOT_PUBLIC")) {
      return [{
        title: "Method main cần từ khóa public",
        detail: "Viết đầy đủ: public static void main(String[] args)",
      }];
    }
    const at = run.stderr.match(/\(((?!__)\w+\.java):(\d+)\)/);
    const known = firstRule(SELENIUM_RULES, run.stderr) ?? firstRule(RUNTIME_RULES, run.stderr);
    const first = run.stderr.split("\n")[0] ?? "";
    return [{
      ...(known ?? { title: "Chương trình bị lỗi khi chạy", detail: first }),
      file: at?.[1],
      line: Number(at?.[2]) || undefined,
    }];
  }
  const selenium = explainSelenium(run);
  if (selenium) return [selenium];
  if (run.stderr.includes("##NO_MAIN_METHOD")) {
    return [{
      title: "Không tìm thấy method main",
      detail: "Java bắt đầu chạy từ public static void main(String[] args). Kiểm tra lại chính tả dòng này.",
    }];
  }
  return [];
}
