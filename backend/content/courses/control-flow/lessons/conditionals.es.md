# Condicionales

Hasta ahora nuestros programas ejecutaban todas las líneas de arriba abajo. Los **condicionales** permiten que un programa elija: ejecutar este bloque solo si algo es verdadero.

## if, elif y else

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

Python comprueba cada condición en orden y ejecuta el **primer** bloque cuya condición sea verdadera. El resto se omite, aunque también fuera verdadero. `elif` (abreviatura de "else if", "si no, si") puede aparecer tantas veces como necesites, y `else` recoge todo lo que queda. Ambos son opcionales.

Fíjate en los dos puntos al final de cada línea y en la **sangría** del cuerpo. Python usa la sangría, normalmente cuatro espacios, para saber qué líneas pertenecen a cada bloque. Equivocarse provoca un `IndentationError` o, peor aún, cambia en silencio lo que hace tu programa.

## Operadores de comparación

Las condiciones suelen construirse con operadores de comparación, que producen `True` o `False`:

- `==` igual a, `!=` distinto de
- `<`, `<=`, `>`, `>=` para el orden

No confundas `=` (asignación) con `==` (comparación). Python también permite encadenar comparaciones de forma natural:

```python
age = 25
print(18 <= age < 65)
print("apple" < "banana")
```

```text
True
True
```

Las cadenas se comparan alfabéticamente, carácter a carácter.

## Operadores booleanos

Combina condiciones con `and`, `or` y `not`.

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

`and` es verdadero solo cuando ambos lados lo son; `or` es verdadero cuando al menos un lado lo es; `not` invierte un valor. Python hace **evaluación en cortocircuito**: en `a and b`, si `a` es falso, `b` nunca se evalúa.

## Valores verdaderos y falsos

Un `if` no necesita un booleano auténtico. Se puede evaluar cualquier valor, y Python decide si cuenta como verdadero o falso. Estos valores son **falsos** (falsy):

- `False` y `None`
- el cero: `0`, `0.0`
- las colecciones vacías: `""`, `[]`, `{}`, `()`, `set()`

Todo lo demás es **verdadero** (truthy). Así, comprobar si algo está vacío resulta breve y legible:

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

## Expresiones condicionales

Para elegir de forma sencilla entre dos valores, una **expresión condicional** de una línea mantiene el código compacto:

```python
stock = 0
label = "available" if stock > 0 else "sold out"
print(label)
```

```text
sold out
```

Léela como "usa `available` si hay existencias; si no, usa `sold out`". Resérvala para casos cortos; una sentencia `if` completa es más clara cuando hay lógica de verdad.

## Puntos clave

- `if`/`elif`/`else` ejecutan el primer bloque cuya condición es verdadera, y la sangría define los bloques.
- Usa `==` para comparar y `=` para asignar; las comparaciones se pueden encadenar, como `0 < x < 10`.
- `and`, `or` y `not` combinan condiciones, y la evaluación se hace en cortocircuito.
- El cero, `None`, `False` y las colecciones vacías son falsos; todo lo demás es verdadero.
- `x if condition else y` elige entre dos valores en una sola expresión.
