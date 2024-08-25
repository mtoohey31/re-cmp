package org.recmp;

import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import org.teavm.jso.core.JSArray;
import org.teavm.jso.JSBody;
import org.teavm.jso.JSBodyImport;
import org.teavm.jso.JSExport;
import org.teavm.jso.JSObject;

public class Regex implements JSObject {
    public static class RegexResult {
        private Regex regex_;
        private String message_;

        public RegexResult(Regex regex) { regex_ = regex; }

        public RegexResult(String message) { message_ = message; }

        @JSExport
        public static boolean isOk(RegexResult res) {
            return res.regex_ != null;
        }

        @JSExport
        public static Regex get(RegexResult res) { return res.regex_; }

        @JSExport
        public static String getMessage(RegexResult res) { return res.message_; }
    }

    private Pattern pattern;

    public Regex(String regex) {
        pattern = Pattern.compile(regex);
    }

    @JSExport
    public static RegexResult compile(String regex) {
        try {
            return new RegexResult(new Regex(regex));
        } catch (PatternSyntaxException e) {
            return new RegexResult(e.getMessage());
        }
    }

    @JSExport
    public static JSArray<JSObject> matches(Regex regex, String text) {
        var matcher = regex.pattern.matcher(text);
        var res = new JSArray();
        while (matcher.find()) {
            res.push(newMatcher(matcher.start(), matcher.end()));
        }
        return res;
    }

    @JSBody(
        params = { "start", "end" },
        script = "return new engines.Match(start, end);",
        imports = @JSBodyImport(
            alias = "engines",
            fromModule = "../../../../../index.mjs"
        )
    )
    private static native JSObject newMatcher(int start, int end);
}
