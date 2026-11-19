# Argumentos

Python ofrece varias formas flexibles de pasar información a una función. Conocerlas te permite diseñar funciones fáciles y seguras de llamar.

## Argumentos posicionales y con nombre

Los **argumentos posicionales** se asocian a los parámetros según su orden. Los **argumentos con nombre** (keyword arguments) se asocian por nombre, así que su orden no importa.

```python
def describe(pet, name):
    print(f"My {pet} is called {name}.")


describe("cat", "Luna")
describe(name="Rex", pet="dog")
describe("parrot", name="Kiwi")
```

```text
My cat is called Luna.
My dog is called Rex.
My parrot is called Kiwi.
```

Puedes mezclar ambos estilos, pero los argumentos posicionales deben ir primero. Los argumentos con nombre hacen que las llamadas se expliquen solas, sobre todo con booleanos: `connect(timeout=5, retry=True)` es mucho más claro que `connect(5, True)`.

## Valores por defecto

Un parámetro puede tener un **valor por defecto**, que se usa cuando quien llama no proporciona uno.

```python
def power(base, exponent=2):
    return base**exponent


print(power(5))
print(power(2, 3))
print(power(2, exponent=10))
```

```text
25
8
1024
```

Los parámetros con valor por defecto deben ir después de los que no lo tienen.

## La trampa del valor por defecto mutable

Los valores por defecto se evalúan **una sola vez**, cuando se define la función, no cada vez que se llama. Con valores inmutables, como números o cadenas, esto nunca importa. Con un valor mutable, como una lista, provoca un error sorprendente:

```python
def add_item(item, basket=[]):
    basket.append(item)
    return basket


print(add_item("apple"))
print(add_item("pear"))
```

```text
['apple']
['apple', 'pear']
```

La segunda llamada no recibió una lista nueva y vacía. Ambas llamadas compartieron el mismo objeto lista creado al definir la función. La solución habitual es usar `None` como valor por defecto y crear la lista dentro de la función:

```python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket


print(add_item("apple"))
print(add_item("pear"))
```

```text
['apple']
['pear']
```

## Cualquier número de argumentos posicionales: *args

Pon `*` delante del nombre de un parámetro para recoger cualquier número de argumentos posicionales extra en una tupla. Por convención se llama `args`.

```python
def average(*args):
    if not args:
        return 0
    return sum(args) / len(args)


print(average(4, 8, 6))
print(average())
```

```text
6.0
0
```

## Cualquier número de argumentos con nombre: **kwargs

Dos asteriscos recogen los argumentos con nombre extra en un diccionario, que por convención se llama `kwargs`.

```python
def make_profile(name, **kwargs):
    profile = {"name": name}
    profile.update(kwargs)
    return profile


print(make_profile("Ana", city="Lima", age=31))
```

```text
{'name': 'Ana', 'city': 'Lima', 'age': 31}
```

## Desempaquetar al llamar

Los asteriscos también funcionan en sentido contrario. `*` reparte una secuencia en argumentos posicionales, y `**` reparte un diccionario en argumentos con nombre.

```python
def point(x, y, z):
    return f"({x}, {y}, {z})"


coords = [1, 2, 3]
options = {"x": 0, "y": 5, "z": 9}
print(point(*coords))
print(point(**options))
```

```text
(1, 2, 3)
(0, 5, 9)
```

El orden habitual de los parámetros en una firma es: parámetros normales, `*args`, parámetros con valor por defecto que deben pasarse por nombre y, por último, `**kwargs`.

## Puntos clave

- Los argumentos posicionales se asocian por orden; los argumentos con nombre, por nombre.
- Los valores por defecto hacen opcionales los parámetros y deben ir después de los obligatorios.
- Nunca uses un objeto mutable como `[]` como valor por defecto; usa `None` y créalo dentro.
- `*args` recoge los argumentos posicionales extra en una tupla y `**kwargs` recoge los que tienen nombre en un diccionario.
- `*` y `**` también desempaquetan secuencias y diccionarios al llamar a una función.
