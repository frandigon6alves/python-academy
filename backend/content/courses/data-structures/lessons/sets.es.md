# Conjuntos

Un **conjunto** (set) es una colección sin orden de elementos **únicos**. Los conjuntos son perfectos para eliminar duplicados, comprobar rápidamente si algo pertenece a un grupo y comparar grupos de cosas.

## Crear conjuntos

Escribe un conjunto con llaves o convierte cualquier iterable con `set()`. Los duplicados desaparecen automáticamente.

```python
tags = {"python", "web", "python", "data"}
print(len(tags))

numbers = set([3, 1, 3, 2, 1])
print(sorted(numbers))

empty = set()
print(type({}).__name__, type(empty).__name__)
```

```text
3
[1, 2, 3]
dict set
```

Ten en cuenta que `{}` crea un **diccionario** vacío, no un conjunto vacío. Para eso usa `set()`.

Los conjuntos no tienen orden, así que no admiten índices ni rebanadas. Al imprimir un conjunto los elementos pueden aparecer en cualquier orden; por eso los ejemplos usan `sorted()` para mostrarlos de forma predecible. Igual que las claves de un diccionario, los elementos de un conjunto deben ser hashables, así que puedes guardar números, cadenas y tuplas, pero no listas.

## Añadir y eliminar

```python
visited = {"Rome"}
visited.add("Oslo")
visited.add("Rome")
visited.update(["Lima", "Cairo"])
visited.discard("Tokyo")
visited.remove("Cairo")
print(sorted(visited))
```

```text
['Lima', 'Oslo', 'Rome']
```

Añadir un elemento que ya está presente no hace nada. `remove()` lanza un `KeyError` si el elemento no existe, mientras que `discard()` lo ignora sin quejarse.

## Comprobaciones de pertenencia rápidas

Comprobar `item in some_set` es extremadamente rápido, incluso con millones de elementos, porque los conjuntos usan hashing. Con una lista, Python tiene que comparar los elementos uno a uno. Cuando te preguntas una y otra vez "¿ya he visto esto?", un conjunto es la herramienta adecuada.

```python
seen = set()
for word in ["red", "blue", "red", "green", "blue"]:
    if word in seen:
        print("Repeated:", word)
    seen.add(word)
```

```text
Repeated: red
Repeated: blue
```

Un modismo popular para eliminar duplicados es `list(set(items))`, pero recuerda que pierde el orden original. Para mantener el orden, usa `list(dict.fromkeys(items))`.

```python
items = ["b", "a", "b", "c", "a"]
print(list(dict.fromkeys(items)))
```

```text
['b', 'a', 'c']
```

## Operaciones de conjuntos

Los conjuntos admiten las operaciones que quizá recuerdes de matemáticas, tanto con operadores como con métodos.

```python
frontend = {"ana", "ben", "carl"}
backend = {"carl", "dina", "ana"}

print(sorted(frontend | backend))
print(sorted(frontend & backend))
print(sorted(frontend - backend))
print(sorted(frontend ^ backend))
```

```text
['ana', 'ben', 'carl', 'dina']
['ana', 'carl']
['ben']
['ben', 'dina']
```

- `|` **unión**: elementos que están en cualquiera de los conjuntos.
- `&` **intersección**: elementos que están en ambos conjuntos.
- `-` **diferencia**: elementos del primer conjunto que no están en el segundo.
- `^` **diferencia simétrica**: elementos que están exactamente en uno de los conjuntos.

Las versiones como método son `union()`, `intersection()`, `difference()` y `symmetric_difference()`, y aceptan cualquier iterable, no solo conjuntos.

También puedes comparar conjuntos:

```python
required = {"id", "email"}
provided = {"id", "email", "name"}
print(required <= provided)
print(required.isdisjoint({"phone"}))
```

```text
True
True
```

`<=` (o `issubset()`) comprueba si todos los elementos de un conjunto están en el otro, e `isdisjoint()` comprueba que dos conjuntos no comparten ningún elemento.

## Puntos clave

- Los conjuntos guardan elementos únicos y hashables, sin orden y sin índices.
- Usa `set()` para un conjunto vacío, porque `{}` es un diccionario vacío.
- Las comprobaciones de pertenencia con `in` son muy rápidas en los conjuntos.
- `|`, `&`, `-` y `^` dan la unión, la intersección, la diferencia y la diferencia simétrica.
