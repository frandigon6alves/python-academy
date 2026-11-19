# Dictionaries

A **dictionary** (`dict`) stores data as **key-value pairs**. Instead of looking items up by position, you look them up by a meaningful key, just like finding a word in a real dictionary to read its definition.

```python
user = {"name": "Iris", "age": 28, "languages": ["Python", "SQL"]}
print(user["name"])
print(user["languages"][0])
print(len(user))
```

```text
Iris
Python
3
```

Keys must be **hashable**, which in practice means immutable values such as strings, numbers or tuples. Values can be anything. Each key appears only once, and since Python 3.7 dictionaries remember the order in which keys were inserted.

## Safe access with .get()

Using square brackets with a missing key raises a `KeyError`. When a key might not exist, use `.get()`, which returns `None` or a default value you choose.

```python
stock = {"apples": 12, "pears": 0}
print(stock.get("apples"))
print(stock.get("kiwis"))
print(stock.get("kiwis", 0))
print("pears" in stock, "kiwis" in stock)
```

```text
12
None
0
True False
```

The `in` operator checks whether a **key** exists; it does not look at the values.

## Adding, updating and removing

Assigning to a key adds it if it is new or replaces its value if it already exists.

```python
stock = {"apples": 12}
stock["pears"] = 5
stock["apples"] += 3
stock.update({"kiwis": 7, "pears": 9})
print(stock)

removed = stock.pop("kiwis")
del stock["pears"]
print(stock, removed)
```

```text
{'apples': 15, 'pears': 9, 'kiwis': 7}
{'apples': 15} 7
```

- `update()` merges another dictionary in, overwriting existing keys.
- `pop(key)` removes a key and returns its value; `del d[key]` removes it without returning anything.
- The `|` operator creates a new merged dictionary: `defaults | overrides`.

## Iterating

Looping over a dictionary gives you its keys. Use `.values()` for the values and `.items()` for key-value pairs, which you can unpack directly in the loop.

```python
prices = {"coffee": 2.5, "tea": 2.0, "cake": 4.25}

for item in prices:
    print(item, end=" ")
print()

print(sum(prices.values()))

for item, price in prices.items():
    print(f"{item:<8}{price:>6.2f}")
```

```text
coffee tea cake 
8.75
coffee    2.50
tea       2.00
cake      4.25
```

Do not add or remove keys while looping over a dictionary; Python raises a `RuntimeError`. Loop over a copy such as `list(d)` if you need to.

## Counting with a dictionary

A very common task is counting things. The `.get()` method with a default makes it short:

```python
text = "the cat and the hat"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)
```

```text
{'the': 2, 'cat': 1, 'and': 1, 'hat': 1}
```

The standard library also offers `collections.Counter`, which does this in one line.

## Nested dictionaries

Values can themselves be dictionaries, which is a natural way to model structured data like the JSON you receive from web services.

```python
team = {
    "ana": {"role": "dev", "level": 3},
    "luis": {"role": "design", "level": 2},
}
print(team["luis"]["role"])
team["ana"]["level"] += 1
print(team["ana"])
```

```text
design
{'role': 'dev', 'level': 4}
```

## Key takeaways

- Dictionaries map unique, hashable keys to values and keep insertion order.
- `d[key]` raises `KeyError` for missing keys; `d.get(key, default)` is the safe alternative.
- Assigning to a key adds or updates it; `update()`, `pop()` and `del` change the dictionary.
- Loop with `.items()` to get keys and values together.
