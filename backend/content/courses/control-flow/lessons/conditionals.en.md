# Conditionals

So far our programs have run every line from top to bottom. **Conditionals** let a program choose: run this block only if something is true.

## if, elif and else

```python
temperature = 23

if temperature > 30:
    print("Hot day")
elif temperature > 18:
    print("Pleasant day")
else:
    print("Cold day")
```

```text
Pleasant day
```

Python checks each condition in order and runs the **first** block whose condition is true. The rest are skipped, even if they would also be true. `elif` (short for "else if") can appear as many times as you need, and `else` catches everything left over. Both are optional.

Notice the colon at the end of each line and the **indentation** of the body. Python uses indentation, usually four spaces, to know which lines belong to which block. Getting it wrong raises an `IndentationError` or, worse, silently changes what your program does.

## Comparison operators

Conditions are usually built with comparison operators, which produce `True` or `False`:

- `==` equal to, `!=` not equal to
- `<`, `<=`, `>`, `>=` for ordering

Do not confuse `=` (assignment) with `==` (comparison). Python also lets you chain comparisons in a natural way:

```python
age = 25
print(18 <= age < 65)
print("apple" < "banana")
```

```text
True
True
```

Strings are compared alphabetically, character by character.

## Boolean operators

Combine conditions with `and`, `or` and `not`.

```python
has_ticket = True
is_vip = False
age = 16

if has_ticket and age >= 18:
    print("Welcome to the concert")
elif has_ticket or is_vip:
    print("Welcome to the matinee")

if not is_vip:
    print("Regular seat")
```

```text
Welcome to the matinee
Regular seat
```

`and` is true only when both sides are true; `or` is true when at least one side is true; `not` flips a value. Python **short-circuits**: in `a and b`, if `a` is false, `b` is never evaluated.

## Truthiness

An `if` does not need a real boolean. Any value can be tested, and Python decides whether it counts as true or false. These values are **falsy**:

- `False` and `None`
- zero: `0`, `0.0`
- empty collections: `""`, `[]`, `{}`, `()`, `set()`

Everything else is **truthy**. This makes checks for emptiness short and readable:

```python
name = ""
cart = ["book"]

if not name:
    print("Please enter a name")
if cart:
    print(f"You have {len(cart)} item(s)")
```

```text
Please enter a name
You have 1 item(s)
```

## Conditional expressions

For simple choices between two values, a one-line **conditional expression** keeps code compact:

```python
stock = 0
label = "available" if stock > 0 else "sold out"
print(label)
```

```text
sold out
```

Read it as "use `available` if the stock is positive, otherwise use `sold out`". Keep these for short cases; a full `if` statement is clearer when there is real logic.

## Key takeaways

- `if`/`elif`/`else` run the first block whose condition is true, and indentation defines the blocks.
- Use `==` to compare and `=` to assign; comparisons can be chained like `0 < x < 10`.
- `and`, `or` and `not` combine conditions, and evaluation short-circuits.
- Zero, `None`, `False` and empty collections are falsy; everything else is truthy.
- `x if condition else y` picks between two values in a single expression.
