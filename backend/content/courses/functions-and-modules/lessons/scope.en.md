# Scope

The **scope** of a name is the part of the program where that name can be seen and used. Understanding scope explains why a variable created inside a function vanishes when the function ends, and why some changes "do not stick".

## Local scope

A name assigned inside a function is **local** to that function. It is created when the function runs and disappears when it returns.

```python
def make_message():
    message = "created inside"
    return message


print(make_message())
print("message" in globals())
```

```text
created inside
False
```

Trying to use `message` outside the function would raise a `NameError`. Each call also gets a fresh set of local names, so calls do not interfere with each other.

## Global scope

Names assigned at the top level of a file are **global**. Functions can read them freely.

```python
tax_rate = 0.2


def with_tax(price):
    return price * (1 + tax_rate)


print(with_tax(50))
```

```text
60.0
```

But assigning to a name inside a function creates a **new local** name, even if a global with the same name exists. This is called **shadowing**:

```python
counter = 0


def increment():
    counter = 1
    return counter


print(increment())
print(counter)
```

```text
1
0
```

The global `counter` was never touched. If you really need to rebind a global, declare it with `global`:

```python
counter = 0


def increment():
    global counter
    counter += 1


increment()
increment()
print(counter)
```

```text
2
```

Use `global` sparingly. Functions that take inputs as parameters and hand results back with `return` are much easier to understand and test.

## Enclosing scope and the LEGB rule

Functions can be defined inside other functions. The inner function can read names from the outer one, which is its **enclosing** scope.

When Python looks up a name, it searches four scopes in order, known as the **LEGB** rule:

1. **L**ocal: the current function.
2. **E**nclosing: any outer functions, from inner to outer.
3. **G**lobal: the top level of the module.
4. **B**uilt-in: names Python provides, such as `len` and `print`.

The first match wins.

```python
x = "global"


def outer():
    x = "enclosing"

    def inner():
        return x

    return inner()


print(outer())
print(len("LEGB"))
```

```text
enclosing
4
```

`inner` found `x` in its enclosing scope before reaching the global one, and `len` was found in the built-in scope. This is also why naming your own variable `list` or `str` is a bad idea: it shadows the built-in.

## Closures

An inner function **remembers** the enclosing variables it uses, even after the outer function has finished. Such a function is called a **closure**.

```python
def make_multiplier(factor):
    def multiply(n):
        return n * factor

    return multiply


double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))
```

```text
10 15
```

Each closure keeps its own `factor`. To **rebind** an enclosing variable from the inner function, declare it `nonlocal`:

```python
def make_counter():
    count = 0

    def tick():
        nonlocal count
        count += 1
        return count

    return tick


tick = make_counter()
tick()
tick()
print(tick())
```

```text
3
```

## Key takeaways

- Names assigned inside a function are local and disappear when it returns.
- Assigning to a name inside a function creates a local name unless it is declared `global` or `nonlocal`.
- Python resolves names using LEGB: Local, Enclosing, Global, Built-in.
- A closure is an inner function that remembers variables from its enclosing scope.
