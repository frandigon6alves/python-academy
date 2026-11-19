# Listas

Una **lista** es una colección ordenada de elementos escrita entre corchetes. Las listas pueden contener cualquier tipo de valor, mezclar tipos y crecer o encogerse mientras el programa se ejecuta.

```python
colors = ["red", "green", "blue"]
mixed = [1, "two", 3.0, True]
empty = []
print(len(colors), colors[0], colors[-1])
print(colors[1:])
```

```text
3 red blue
['green', 'blue']
```

Los índices y las rebanadas funcionan exactamente igual que con las cadenas.

## Las listas son mutables

A diferencia de las cadenas, las listas son **mutables**: puedes modificarlas en su sitio.

```python
colors = ["red", "green", "blue"]
colors[1] = "yellow"
print(colors)
```

```text
['red', 'yellow', 'blue']
```

## Métodos habituales

```python
tasks = ["wash", "cook"]
tasks.append("read")
tasks.insert(0, "wake up")
tasks.extend(["code", "sleep"])
print(tasks)

tasks.remove("cook")
last = tasks.pop()
first = tasks.pop(0)
print(tasks, last, first)

print(tasks.index("read"), tasks.count("wash"), "code" in tasks)
```

```text
['wake up', 'wash', 'cook', 'read', 'code', 'sleep']
['wash', 'read', 'code'] sleep wake up
1 1 True
```

- `append(x)` añade un elemento al final; `extend(iterable)` añade varios.
- `insert(i, x)` añade un elemento en una posición.
- `remove(x)` elimina el primer valor que coincide; `pop()` quita y devuelve un elemento, por defecto el último.
- `index(x)` encuentra una posición y `count(x)` cuenta las apariciones.

La mayoría de estos métodos modifican la lista y devuelven `None`. Escribir `tasks = tasks.append("x")` es un error clásico que sustituye tu lista por `None`.

## Ordenar

Hay dos formas de ordenar. El método `sort()` ordena la lista en su sitio, mientras que la función integrada `sorted()` devuelve una lista nueva ordenada y deja intacta la original.

```python
scores = [70, 95, 82]
ranking = sorted(scores, reverse=True)
print(ranking, scores)

scores.sort()
print(scores)

words = ["banana", "Kiwi", "apple"]
print(sorted(words))
print(sorted(words, key=str.lower))
print(sorted(words, key=len))
```

```text
[95, 82, 70] [70, 95, 82]
[70, 82, 95]
['Kiwi', 'apple', 'banana']
['apple', 'banana', 'Kiwi']
['Kiwi', 'apple', 'banana']
```

El argumento `key` recibe una función que se aplica a cada elemento para decidir el orden. Por defecto, las mayúsculas se ordenan antes que las minúsculas, por eso `key=str.lower` resulta útil para un orden alfabético.

## Alias y copias

Asignar una lista a un nombre nuevo **no** la copia. Ambos nombres se refieren a la misma lista, así que un cambio hecho a través de uno se ve también a través del otro.

```python
original = [1, 2, 3]
alias = original
alias.append(4)
print(original)
print(alias is original)
```

```text
[1, 2, 3, 4]
True
```

Para obtener una lista independiente, haz una copia con `list.copy()`, `list(...)` o la rebanada `[:]`:

```python
original = [1, 2, 3]
clone = original.copy()
clone.append(99)
print(original, clone)
```

```text
[1, 2, 3] [1, 2, 3, 99]
```

Estas son copias **superficiales**: la lista exterior es nueva, pero las listas anidadas que contenga siguen compartidas. Para estructuras anidadas totalmente independientes, usa `copy.deepcopy()` del módulo `copy`.

```python
import copy

grid = [[0, 0], [0, 0]]
shallow = grid.copy()
deep = copy.deepcopy(grid)
grid[0][0] = 7
print(shallow[0][0], deep[0][0])
```

```text
7 0
```

## Puntos clave

- Las listas son colecciones ordenadas y mutables que admiten índices y rebanadas.
- `append`, `extend`, `insert`, `remove` y `pop` modifican la lista en su sitio.
- `list.sort()` ordena en su sitio y devuelve `None`; `sorted()` devuelve una lista nueva.
- La asignación crea un alias, no una copia; usa `.copy()` o `copy.deepcopy()` cuando necesites una.
