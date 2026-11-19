# Types

Every value in Python has a **type**. The type decides what the value can do: you can divide numbers, but not sentences. Let's meet the most common built-in types.

## Numbers

Whole numbers are `int` and numbers with a decimal point are `float`.

```python
apples = 7
price = 2.5
print(apples * price)
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2**10)
```

```text
17.5
3.5
3
1
1024
```

Notice that `/` always returns a float, even when the result is whole. Use `//` for floor division (it rounds down) and `%` for the remainder. `**` raises a number to a power.

Integers in Python can be as large as your memory allows, so you never have to worry about overflow. Floats, on the other hand, are stored in binary and can show tiny rounding errors:

```python
print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
```

```text
0.30000000000000004
0.3
```

## Booleans

The `bool` type has exactly two values: `True` and `False`. They usually come from comparisons.

```python
is_adult = 20 >= 18
print(is_adult)
print(3 == 4)
```

```text
True
False
```

## None

`None` is a special value that means "nothing here" or "no value yet". It is the only value of its type, `NoneType`.

```python
winner = None
print(winner)
print(winner is None)
```

```text
None
True
```

To check for `None`, use `is None` rather than `== None`.

## Checking a type with type()

The built-in `type()` function tells you the type of any value.

```python
print(type(42))
print(type(3.14))
print(type("hi"))
print(type(True))
print(type(None))
```

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

## Converting between types

You can convert a value into another type by calling the type's name like a function: `int()`, `float()` and `str()`.

```python
print(int("42") + 1)
print(float("3.5") * 2)
print(str(100) + " points")
print(int(9.99))
```

```text
43
7.0
100 points
9
```

Two details are worth remembering. First, `int()` on a float **truncates** toward zero; it does not round. Second, conversion only works when it makes sense: `int("hello")` raises a `ValueError` because "hello" is not a number.

Mixing types without converting is a common beginner mistake. `"Age: " + 30` fails because Python will not silently glue text and numbers together. Write `"Age: " + str(30)` instead, or use an f-string, which you will meet soon.

You can also turn values into booleans with `bool()`. Zero, empty strings and `None` become `False`; most other values become `True`.

```python
print(bool(0), bool(""), bool("0"), bool(5))
```

```text
False False True True
```

## Key takeaways

- `int` holds whole numbers, `float` holds decimals, `bool` holds `True` or `False`.
- `/` always produces a float; `//` is floor division and `%` gives the remainder.
- `None` represents the absence of a value; test it with `is None`.
- `type()` reveals a value's type, and `int()`, `float()` and `str()` convert between types.
- `int()` truncates floats, and invalid conversions raise a `ValueError`.
