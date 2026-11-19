# Diccionarios

Un **diccionario** (`dict`) guarda los datos como **parejas clave-valor**. En lugar de buscar los elementos por posición, los buscas por una clave con significado, igual que buscas una palabra en un diccionario de verdad para leer su definición.

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

Las claves deben ser **hashables**, lo que en la práctica significa valores inmutables como cadenas, números o tuplas. Los valores pueden ser cualquier cosa. Cada clave aparece una sola vez y, desde Python 3.7, los diccionarios recuerdan el orden en que se insertaron las claves.

## Acceso seguro con .get()

Usar corchetes con una clave que no existe lanza un `KeyError`. Cuando una clave puede no existir, usa `.get()`, que devuelve `None` o un valor por defecto que tú elijas.

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

El operador `in` comprueba si existe una **clave**; no mira los valores.

## Añadir, actualizar y eliminar

Asignar a una clave la añade si es nueva o sustituye su valor si ya existe.

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

- `update()` incorpora otro diccionario y sobrescribe las claves existentes.
- `pop(key)` elimina una clave y devuelve su valor; `del d[key]` la elimina sin devolver nada.
- El operador `|` crea un diccionario nuevo combinado: `defaults | overrides`.

## Recorrer un diccionario

Recorrer un diccionario te da sus claves. Usa `.values()` para los valores y `.items()` para las parejas clave-valor, que puedes desempaquetar directamente en el bucle.

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

No añadas ni elimines claves mientras recorres un diccionario; Python lanza un `RuntimeError`. Si lo necesitas, recorre una copia como `list(d)`.

## Contar con un diccionario

Una tarea muy habitual es contar cosas. El método `.get()` con un valor por defecto lo hace breve:

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

La biblioteca estándar también ofrece `collections.Counter`, que hace esto en una sola línea.

## Diccionarios anidados

Los valores pueden ser a su vez diccionarios, una forma natural de modelar datos estructurados como el JSON que recibes de los servicios web.

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

## Puntos clave

- Los diccionarios asocian claves únicas y hashables a valores, y mantienen el orden de inserción.
- `d[key]` lanza `KeyError` si la clave no existe; `d.get(key, default)` es la alternativa segura.
- Asignar a una clave la añade o la actualiza; `update()`, `pop()` y `del` modifican el diccionario.
- Recorre con `.items()` para obtener claves y valores a la vez.
