# Input and Output

Programs become interesting when they talk to the person using them. In Python, `print()` sends text out and `input()` brings text in.

## print() in more detail

`print()` accepts any number of values separated by commas. By default it puts a space between them and a newline at the end.

```python
print("Total:", 3, True)
```

```text
Total: 3 True
```

Two keyword arguments let you change that behaviour. `sep` controls what goes between the values and `end` controls what goes at the end.

```python
print("2024", "05", "17", sep="-")
print("Loading", end="...")
print("done")
print("a", "b", "c", sep="")
```

```text
2024-05-17
Loading...done
abc
```

Because the second call ended with `"..."` instead of a newline, the next `print()` continued on the same line.

## input() always returns a string

`input()` shows a prompt, waits for the user to type something and press Enter, and returns what they typed **as a string**.

```python
name = input("What is your name? ")
print("Nice to meet you,", name)
```

This is a classic source of bugs. Even if the user types `21`, you get the text `"21"`, not the number 21. To do maths you must convert it first:

```python
age_text = input("How old are you? ")
age = int(age_text)
print("Next year you will be", age + 1)
```

If the user types something that is not a number, `int()` raises a `ValueError`. Later you will learn how to handle that gracefully.

## f-strings

Building messages with `+` and `str()` gets clumsy fast. **f-strings** are the modern, readable way to mix text and values. Put an `f` before the opening quote and write expressions inside curly braces.

```python
name = "Lina"
items = 3
price = 4.5
print(f"{name} bought {items} items for {items * price} euros.")
```

```text
Lina bought 3 items for 13.5 euros.
```

Any valid expression can go inside the braces, including method calls such as `{name.upper()}`.

## Format specifications

After the expression you can add a colon and a **format spec** to control how the value is displayed.

```python
pi = 3.14159265
big = 1234567
ratio = 0.256
print(f"{pi:.2f}")
print(f"{big:,}")
print(f"{ratio:.1%}")
print(f"[{'left':<8}]")
print(f"[{'right':>8}]")
print(f"[{'mid':^9}]")
print(f"{7:03d}")
```

```text
3.14
1,234,567
25.6%
[left    ]
[   right]
[   mid   ]
007
```

Here is what each spec means:

- `.2f` shows a float with two decimal places.
- `,` adds thousands separators.
- `.1%` multiplies by 100 and adds a percent sign.
- `<8`, `>8` and `^9` align text left, right or centre within that width.
- `03d` pads an integer with zeros to three digits.

A handy debugging trick: writing `=` after an expression prints both the expression and its value.

```python
x = 10
print(f"{x * 2 = }")
```

```text
x * 2 = 20
```

## Key takeaways

- `print()` separates values with `sep` (default a space) and finishes with `end` (default a newline).
- `input()` always returns a string, so convert it with `int()` or `float()` before doing maths.
- f-strings embed expressions inside `{}` for readable messages.
- Format specs like `:.2f`, `:,`, `:>8` and `:.1%` control how values look.
