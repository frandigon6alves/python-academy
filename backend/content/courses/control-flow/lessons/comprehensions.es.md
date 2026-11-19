# Comprensiones

Una **comprensión** construye una colección nueva a partir de un iterable existente en una sola expresión legible. Sustituye el patrón habitual de "crear una lista vacía, recorrer y añadir".

## Comprensiones de listas

Esta es la forma larga de elevar al cuadrado unos números:

```python
squares = []
for n in range(1, 6):
    squares.append(n * n)
print(squares)
```

```text
[1, 4, 9, 16, 25]
```

Y esto es lo mismo con una comprensión de lista:

```python
squares = [n * n for n in range(1, 6)]
print(squares)
```

```text
[1, 4, 9, 16, 25]
```

Léela desde el centro: "por cada `n` en `range(1, 6)`, pon `n * n` en la lista nueva". La forma general es `[expression for item in iterable]`.

La expresión puede ser cualquier cosa, incluidas llamadas a métodos:

```python
words = ["python", "is", "fun"]
print([w.upper() for w in words])
print([len(w) for w in words])
```

```text
['PYTHON', 'IS', 'FUN']
[6, 2, 3]
```

## Filtrar con una condición

Añade `if` al final para quedarte solo con algunos elementos.

```python
numbers = [3, 8, 12, 5, 6, 1]
evens = [n for n in numbers if n % 2 == 0]
print(evens)
```

```text
[8, 12, 6]
```

Si quieres **transformar** cada elemento de forma distinta según una condición, pon una expresión condicional al principio. Fíjate en la posición diferente:

```python
numbers = [3, 8, 12, 5]
labels = ["even" if n % 2 == 0 else "odd" for n in numbers]
print(labels)
```

```text
['odd', 'even', 'even', 'odd']
```

Un `if` al final filtra (salen menos elementos); un `if ... else` al principio elige un valor (sale el mismo número de elementos).

## Comprensiones de diccionarios

Usa llaves y una pareja `key: value` para construir un diccionario.

```python
names = ["ana", "bruno", "carla"]
lengths = {name: len(name) for name in names}
print(lengths)

prices = {"tea": 2.0, "cake": 4.5, "juice": 3.0}
cheap = {item: p for item, p in prices.items() if p < 4}
print(cheap)
```

```text
{'ana': 3, 'bruno': 5, 'carla': 5}
{'tea': 2.0, 'juice': 3.0}
```

## Comprensiones de conjuntos

Las llaves con una sola expresión construyen un conjunto, que elimina los duplicados automáticamente.

```python
words = ["Apple", "avocado", "Banana", "blueberry", "cherry"]
initials = {w[0].lower() for w in words}
print(sorted(initials))
```

```text
['a', 'b', 'c']
```

Imprimimos `sorted(initials)` porque los conjuntos no garantizan ningún orden.

## Varias cláusulas for

Una comprensión puede contener más de un `for`. Se ejecutan en el mismo orden que lo harían unos bucles anidados.

```python
pairs = [(x, y) for x in range(1, 3) for y in "ab"]
print(pairs)
```

```text
[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

## Cuándo no usarlas

Las comprensiones son ideales para transformaciones cortas. Si necesitas varias condiciones, bucles anidados y expresiones complejas a la vez, un bucle `for` normal es más fácil de leer y depurar. Evita también las comprensiones usadas solo por sus efectos secundarios, como imprimir; un bucle simple lo expresa con más honestidad.

## Puntos clave

- `[expr for item in iterable]` construye una lista en una sola expresión.
- Un `if` al final filtra elementos; un `x if cond else y` al principio elige un valor por elemento.
- `{k: v for ...}` construye un diccionario y `{expr for ...}` construye un conjunto.
- Prefiere un bucle normal cuando la lógica se complica.
