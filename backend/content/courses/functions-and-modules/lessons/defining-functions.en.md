# Defining Functions

A **function** is a named, reusable block of code. You have already used built-in functions like `print()`, `len()` and `int()`. Now it is time to write your own.

## The def statement

```python
def greet():
    print("Hello there!")


greet()
greet()
```

```text
Hello there!
Hello there!
```

`def` starts the definition, followed by the function name, parentheses and a colon. The indented lines below form the **body**. Defining a function does not run it; the body only runs when you **call** the function by writing its name followed by parentheses.

Function names follow the same snake_case convention as variables. Good names usually start with a verb: `calculate_total`, `send_email`, `is_valid`.

## Parameters

Functions become far more useful when they accept input. The names inside the parentheses are **parameters**; the values you pass when calling are **arguments**.

```python
def greet(name):
    print(f"Hello, {name}!")


greet("Maya")
greet("Omar")
```

```text
Hello, Maya!
Hello, Omar!
```

## Returning a value

`print()` shows something on the screen, but often you want the function to hand a result back so the rest of your program can use it. That is what `return` does.

```python
def area(width, height):
    return width * height


room = area(4, 3)
print(room)
print(area(2, 5) + area(1, 1))
```

```text
12
11
```

`return` ends the function immediately and sends the value back to the caller. Any code after a `return` in the same block never runs. A function can have several `return` statements, for example one in each branch of an `if`:

```python
def sign(n):
    if n > 0:
        return "positive"
    if n < 0:
        return "negative"
    return "zero"


print(sign(-3), sign(0), sign(8))
```

```text
negative zero positive
```

You can return several values at once by separating them with commas. Python packs them into a tuple, which you can unpack on the receiving side:

```python
def min_max(numbers):
    return min(numbers), max(numbers)


low, high = min_max([4, 9, 1, 7])
print(low, high)
```

```text
1 9
```

## The default return value: None

If a function finishes without reaching a `return`, or uses a bare `return`, it returns `None`.

```python
def shout(text):
    print(text.upper())


result = shout("hi")
print(result)
```

```text
HI
None
```

This is a classic mix-up: `shout()` **prints** a value but does not **return** one. If you need to use the result later, return it.

## Docstrings

A **docstring** is a string written as the first statement in a function body. It documents what the function does, and tools such as `help()` display it.

```python
def celsius_to_fahrenheit(celsius):
    """Convert a temperature from Celsius to Fahrenheit."""
    return celsius * 9 / 5 + 32


print(celsius_to_fahrenheit(100))
print(celsius_to_fahrenheit.__doc__)
```

```text
212.0
Convert a temperature from Celsius to Fahrenheit.
```

Use triple quotes, write a short summary line in the imperative mood, and add more detail below it when the function is not obvious.

## Key takeaways

- `def name(parameters):` defines a function; calling it with `name(arguments)` runs the body.
- `return` sends a value back to the caller and ends the function immediately.
- A function without a `return` gives back `None`, so printing is not the same as returning.
- Returning several values packs them into a tuple you can unpack.
- A docstring right after the `def` line documents what the function does.
