# Tuplas

Una **tupla** es una colección ordenada, como una lista, pero **inmutable**: una vez creada, no se pueden añadir, quitar ni sustituir sus elementos. Las tuplas se escriben entre paréntesis.

```python
point = (3, 4)
rgb = (255, 128, 0)
print(point[0], rgb[-1], len(rgb))
print(rgb[:2])
```

```text
3 0 3
(255, 128)
```

Los índices, las rebanadas, `len()`, `in` y los bucles funcionan igual que con las listas.

## Crear tuplas

En realidad, lo que crea una tupla es la **coma**, no los paréntesis. Esto importa en las tuplas de un solo elemento:

```python
a = 5
b = (5,)
c = 1, 2, 3
print(type(a).__name__, type(b).__name__, c)
print(tuple("abc"))
```

```text
int tuple (1, 2, 3)
('a', 'b', 'c')
```

`(5)` es simplemente el número 5 entre paréntesis. Para crear una tupla de un elemento necesitas una coma final: `(5,)`. La función integrada `tuple()` convierte cualquier iterable en una tupla.

## Inmutabilidad

No puedes cambiar los elementos de una tupla:

```python
point = (3, 4)
try:
    point[0] = 10
except TypeError as error:
    print("Error:", error)
```

```text
Error: 'tuple' object does not support item assignment
```

Por eso las tuplas solo tienen dos métodos, `count()` e `index()`. Si necesitas una versión modificada, construye una tupla nueva:

```python
point = (3, 4)
moved = (point[0] + 1, point[1])
print(moved)
```

```text
(4, 4)
```

Un detalle sutil: una tupla guarda referencias a objetos. Si uno de esos objetos es mutable, como una lista, ese objeto interior todavía puede cambiar, aunque la tupla en sí no se pueda reasignar.

## Desempaquetado

El **desempaquetado** asigna los elementos de una tupla (o de cualquier iterable) a varios nombres a la vez. Ya lo has usado para intercambiar variables y en funciones que devuelven varios valores.

```python
person = ("Lucia", 34, "Madrid")
name, age, city = person
print(f"{name} is {age} and lives in {city}")
```

```text
Lucia is 34 and lives in Madrid
```

El número de nombres debe coincidir con el número de elementos. Un nombre con asterisco recoge "el resto" en una lista:

```python
first, *middle, last = (1, 2, 3, 4, 5)
print(first, middle, last)
```

```text
1 [2, 3, 4] 5
```

El desempaquetado es especialmente práctico en los bucles:

```python
pairs = [("x", 1), ("y", 2)]
for letter, number in pairs:
    print(letter * number)
```

```text
x
yy
```

## Cuándo usar una tupla

Elige una tupla cuando los datos tienen una **estructura fija** y no deben cambiar, como unas coordenadas, un color RGB o una fila de una base de datos. Elige una lista cuando tienes un **número variable** de elementos similares que pueden crecer o cambiar.

Las tuplas también tienen ventajas prácticas. Como son inmutables, las tuplas formadas por valores inmutables son **hashables**, así que pueden usarse como claves de diccionario o guardarse en conjuntos, cosa que las listas no permiten:

```python
distances = {("Paris", "Rome"): 1105, ("Lima", "Quito"): 1320}
print(distances[("Paris", "Rome")])
```

```text
1105
```

La inmutabilidad también comunica una intención: quien lee tu código sabe que esos valores no deberían cambiar.

## Puntos clave

- Las tuplas son ordenadas e inmutables; admiten índices, rebanadas y bucles.
- La coma es la que crea la tupla, así que una tupla de un elemento necesita una coma final: `(5,)`.
- El desempaquetado asigna elementos a varios nombres, y `*rest` recoge los sobrantes.
- Usa tuplas para registros fijos y como claves de diccionario; usa listas para colecciones que cambian.
