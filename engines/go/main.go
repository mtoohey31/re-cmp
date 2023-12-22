//go:build js && wasm

package main

import (
	"fmt"
	"regexp"
	"syscall/js"
)

// TODO: What's the right way to handle invalid argument counts?

var newPromise = js.Global().Get("Promise").New

func main() {
	done := make(chan struct{})

	js.Global().Set("reCmpEngineGo", js.ValueOf(map[string]any{
		"compile": js.FuncOf(func(this js.Value, args []js.Value) any {
			if l := len(args); l != 1 {
				panic(fmt.Sprintf("expected 1 argument, got %d", l))
			} else if t := args[0].Type(); t != js.TypeString {
				panic(fmt.Sprintf("expected argument of type string, got %s", t))
			}

			expr := args[0].String()

			return newPromise(js.FuncOf(func(this js.Value, args []js.Value) any {
				if len(args) != 2 {
					panic(fmt.Sprintf("expected 2 argument, got %d", len(args)))
				}

				resolve := args[0]
				reject := args[1]

				go func() {
					r, err := regexp.Compile(expr)
					if err != nil {
						errString := js.ValueOf(err.Error())
						syntaxError := js.Global().Get("SyntaxError").New(errString)
						reject.Invoke(syntaxError)
						return
					}

					matchesFunc := js.FuncOf(func(this js.Value, args []js.Value) any {
						if l := len(args); l != 1 {
							panic(fmt.Sprintf("expected 1 argument, got %d", l))
						} else if t := args[0].Type(); t != js.TypeString {
							panic(fmt.Sprintf("expected argument of type string, got %s", t))
						}

						text := args[0].String()

						return newPromise(js.FuncOf(func(this js.Value, args []js.Value) any {
							if len(args) != 2 {
								panic(fmt.Sprintf("expected 2 argument, got %d", len(args)))
							}

							resolve := args[0]

							matches := r.FindAllStringIndex(text, -1)
							res := make([]any, len(matches))
							for i, match := range matches {
								res[i] = map[string]any{
									"start": match[0],
									"end":   match[1],
								}
							}

							resolve.Invoke(js.ValueOf(res))

							return nil
						}))
					})

					resolve.Invoke(js.ValueOf(map[string]any{
						"matches": matchesFunc,
						"drop": js.FuncOf(func(this js.Value, args []js.Value) any {
							matchesFunc.Release()
							return js.Undefined()
						}),
					}))
				}()

				return nil
			}))
		}),
		"drop": js.FuncOf(func(js.Value, []js.Value) any {
			done <- struct{}{}
			return js.Undefined()
		}),
	}))

	<-done
	js.Global().Delete("reCmpEngineGo")
}
