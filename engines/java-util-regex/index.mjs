let{compile:compile_,matches:matches_,RegexResult:{isOk,get,getMessage}}=await import("./build/generated/teavm/js/java-util-regex.js");class Regex{constructor(regex){this.regex=regex}regex;matches(text){return matches_(this.regex,text)}drop(){}}class Engine{compile(regex){const res=compile_(regex);if(isOk(res)){return new Regex(get(res))}else{throw SyntaxError(getMessage(res))}}drop(){}}export const engine=new Engine;