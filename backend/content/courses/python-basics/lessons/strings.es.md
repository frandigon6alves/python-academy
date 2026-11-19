# Cadenas de texto

Una **cadena** (`str`) es una secuencia de caracteres y se usa para cualquier tipo de texto. Puedes escribir cadenas con comillas simples o dobles; ambas significan lo mismo.

```python
first = "Ada"
last = "Lovelace"
full = first + " " + last
print(full)
print(len(full))
print("ha" * 3)
```

```text
Ada Lovelace
12
hahaha
```

El operador `+` une cadenas (esto se llama concatenación), `*` las repite y `len()` cuenta los caracteres, espacios incluidos. Para texto de varias líneas, usa comillas triples: `"""así"""`.

## Índices

Cada carácter tiene una posición llamada **índice**. Los índices empiezan en 0, así que el primer carácter está en el índice 0. Los índices negativos cuentan desde el final: `-1` es el último carácter.

```python
word = "Python"
print(word[0])
print(word[5])
print(word[-1])
print(word[-2])
```

```text
P
n
n
o
```

Pedir un índice que no existe, como `word[10]`, lanza un `IndexError`.

## Rebanadas (slicing)

Una **rebanada** extrae una parte de una cadena con `[start:stop]`. El inicio se incluye y el final se excluye. Omitir el inicio significa "desde el principio"; omitir el final significa "hasta el final".

```python
word = "Python"
print(word[0:2])
print(word[2:])
print(word[:4])
print(word[-3:])
print(word[::2])
print(word[::-1])
```

```text
Py
thon
Pyth
hon
Pto
nohtyP
```

El tercer número, opcional, es el **paso**. Un paso de 2 toma uno de cada dos caracteres, y un paso de -1 recorre la cadena hacia atrás, un truco práctico para invertirla. A diferencia de los índices, las rebanadas nunca dan error por posiciones fuera de rango; simplemente devuelven lo que cabe.

## Métodos útiles

Las cadenas traen muchos **métodos** integrados, funciones que llamas con un punto después del valor.

```python
text = "  Hello, World  "
print(text.strip())
print(text.lower())
print(text.upper())
print(text.strip().replace("World", "Python"))
print("a,b,c".split(","))
print("-".join(["2024", "01", "31"]))
print("banana".count("a"))
print("banana".find("n"))
print("report.pdf".endswith(".pdf"))
```

```text
Hello, World
  hello, world  
  HELLO, WORLD  
Hello, Python
['a', 'b', 'c']
2024-01-31
3
2
True
```

`strip()` elimina los espacios de los extremos, `split()` divide una cadena en una lista y `join()` hace lo contrario. Para comprobar si un texto aparece dentro de una cadena, usa el operador `in`: `"ell" in "Hello"` es `True`.

## Las cadenas son inmutables

Las cadenas no se pueden modificar después de crearlas; son **inmutables**. Intentar asignar a un índice falla:

```python
name = "Bob"
try:
    name[0] = "R"
except TypeError as error:
    print("Error:", error)
```

```text
Error: 'str' object does not support item assignment
```

Entonces, ¿cómo funcionan métodos como `upper()`? Nunca modifican el original. Construyen y devuelven una cadena **nueva**. Si quieres conservar el resultado, asígnalo a un nombre.

```python
name = "bob"
name.upper()
print(name)
name = name.upper()
print(name)
```

```text
bob
BOB
```

## Puntos clave

- Las cadenas son secuencias de caracteres; `+` las une, `*` las repite y `len()` las cuenta.
- Los índices empiezan en 0, y los negativos cuentan desde el final.
- Las rebanadas usan `[start:stop:step]`, incluyen el inicio y excluyen el final.
- Métodos como `strip()`, `split()`, `join()` y `replace()` devuelven cadenas nuevas.
- Las cadenas son inmutables, así que reasigna el resultado si quieres conservar un cambio.
