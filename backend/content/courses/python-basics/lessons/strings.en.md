# Strings

A **string** (`str`) is a sequence of characters, used for any kind of text. You can write strings with single or double quotes; both mean the same thing.

```python
first = "Ada"
last = "Lovelace"
full = first + " " + last
print(full)
print(len(full))
print("ha" * 3)
```

```text
Ada Lovelace
12
hahaha
```

The `+` operator joins strings (this is called concatenation), `*` repeats them, and `len()` counts the characters, including spaces. For text that spans several lines, use triple quotes: `"""like this"""`.

## Indexing

Each character has a position called an **index**. Indexes start at 0, so the first character is at index 0. Negative indexes count from the end: `-1` is the last character.

```python
word = "Python"
print(word[0])
print(word[5])
print(word[-1])
print(word[-2])
```

```text
P
n
n
o
```

Asking for an index that does not exist, like `word[10]`, raises an `IndexError`.

## Slicing

A **slice** extracts a part of a string using `[start:stop]`. The start is included, the stop is excluded. Leaving out start means "from the beginning"; leaving out stop means "to the end".

```python
word = "Python"
print(word[0:2])
print(word[2:])
print(word[:4])
print(word[-3:])
print(word[::2])
print(word[::-1])
```

```text
Py
thon
Pyth
hon
Pto
nohtyP
```

The optional third number is the **step**. A step of 2 takes every second character, and a step of -1 walks backwards, which is a neat trick for reversing a string. Unlike indexing, slicing never raises an error for out-of-range positions; it simply returns whatever fits.

## Useful methods

Strings come with many built-in **methods**, functions you call with a dot after the value.

```python
text = "  Hello, World  "
print(text.strip())
print(text.lower())
print(text.upper())
print(text.strip().replace("World", "Python"))
print("a,b,c".split(","))
print("-".join(["2024", "01", "31"]))
print("banana".count("a"))
print("banana".find("n"))
print("report.pdf".endswith(".pdf"))
```

```text
Hello, World
  hello, world  
  HELLO, WORLD  
Hello, Python
['a', 'b', 'c']
2024-01-31
3
2
True
```

`strip()` removes surrounding whitespace, `split()` breaks a string into a list, and `join()` does the opposite. To test whether some text appears inside a string, use the `in` operator: `"ell" in "Hello"` is `True`.

## Strings are immutable

Strings cannot be changed after they are created; they are **immutable**. Trying to assign to an index fails:

```python
name = "Bob"
try:
    name[0] = "R"
except TypeError as error:
    print("Error:", error)
```

```text
Error: 'str' object does not support item assignment
```

So how do methods like `upper()` work? They never modify the original. They build and return a **new** string. If you want to keep the result, assign it to a name.

```python
name = "bob"
name.upper()
print(name)
name = name.upper()
print(name)
```

```text
bob
BOB
```

## Key takeaways

- Strings are sequences of characters; `+` joins them, `*` repeats them and `len()` counts them.
- Indexes start at 0, and negative indexes count from the end.
- Slices use `[start:stop:step]`, include start and exclude stop.
- Methods like `strip()`, `split()`, `join()` and `replace()` return new strings.
- Strings are immutable, so reassign the result if you want to keep a change.
