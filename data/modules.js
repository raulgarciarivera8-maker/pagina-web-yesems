// Data: temario ACREDITA-BACH (CENEVAL) — 7 áreas del Marco Curricular Común.
// Extraído de las guías oficiales de estudio. Cada área incluye su guía PDF completa.
window.modulesData = {
  matematico: {
    title: "Pensamiento Matemático",
    reactivos: "30 reactivos",
    guide: "assets/pdfs/guia_pensamiento_matematico.pdf",
    intro: "30 reactivos de opción múltiple en 6 subáreas. Distribución aproximada: Estadístico (4), Probabilístico (3), Algebraico (8), Aritmético (5), Geométrico (4) y Variacional (6). Se permite calculadora científica no programable.",
    subsections: [
      {
        title: "Pensamiento estadístico",
        topics: [
          {n:1,title:"Tipos de variables y muestreo",def:"La estadística organiza, resume e interpreta datos. La descriptiva describe un conjunto; la inferencial generaliza de una muestra a la población.",concepts:["<b>Cualitativa:</b> expresa cualidades; nominal (sin orden) u ordinal (con orden).","<b>Cuantitativa discreta:</b> valores enteros y contables (número de hijos).","<b>Cuantitativa continua:</b> admite decimales (estatura, peso, tiempo).","<b>Muestreo:</b> aleatorio simple, sistemático (cada k-ésimo), estratificado (por estratos) y por conglomerados (grupos completos)."],example:"Si puedes contar es discreta; si mides con decimales es continua; si describe una cualidad es cualitativa."},
          {n:2,title:"Medidas de tendencia central",def:"Estadísticos que resumen un conjunto de datos con un valor representativo.",formula:"Media: x̄ = (suma de datos) ÷ (número de datos)\nMediana: valor central con los datos ordenados\nModa: el valor que más se repite",example:"Datos 4, 8, 6, 8, 10, 8, 6 → media = 50÷7 = 7.14; mediana = 8; moda = 8. La mediana es más confiable si hay datos atípicos."},
          {n:3,title:"Medidas de dispersión",def:"Indican qué tan separados están los datos respecto de la media. A mayor dispersión, datos más heterogéneos.",formula:"Rango = máximo − mínimo\nVarianza: s² = Σ(x − x̄)² ÷ n\nDesviación estándar: s = √(varianza)",example:"Datos 2, 4, 6 (media 4): varianza = (4+0+4)÷3 = 2.67; desviación = √2.67 = 1.63; rango = 4."}
        ]
      },
      {
        title: "Pensamiento probabilístico",
        topics: [
          {n:4,title:"Técnicas de conteo",def:"La probabilidad mide qué tan posible es un evento (de 0 imposible a 1 seguro). Las técnicas de conteo cuentan los casos posibles.",formula:"Principio multiplicativo: m × n\nPermutaciones (importa el orden): P(n,r) = n! ÷ (n−r)!\nCombinaciones (no importa el orden): C(n,r) = n! ÷ [r!(n−r)!]",example:"Elegir 2 de 5 (sin orden): C(5,2) = 120 ÷ 12 = 10. Ordenar 3 libros: P(3,3) = 3! = 6."},
          {n:5,title:"Probabilidad simple (Laplace)",def:"Cuando todos los resultados son igualmente posibles se aplica la regla de Laplace.",formula:"P(A) = casos favorables ÷ casos posibles",example:"Urna con 3 rojas, 5 azules y 2 verdes (10): P(azul) = 5/10 = 50%."},
          {n:6,title:"Probabilidad condicional y Bayes",def:"P(A|B) es la probabilidad de A dado que ya ocurrió B.",formula:"P(A|B) = P(A y B) ÷ P(B)\nBayes: P(A|B) = [P(B|A)·P(A)] ÷ P(B)",example:"De 100 personas, 40 hacen ejercicio y 30 de ellas tienen buena salud: P(salud|ejercicio) = 30/40 = 75%."}
        ]
      },
      {
        title: "Pensamiento algebraico",
        topics: [
          {n:7,title:"Lenguaje y expresiones algebraicas",def:"El álgebra usa letras (variables) para representar cantidades desconocidas o que cambian.",concepts:["<b>Monomio:</b> un término (5x).","<b>Polinomio:</b> varios términos (3x²+2x−1).","<b>Coeficiente:</b> número que multiplica.","<b>Grado:</b> mayor exponente."],example:"\"El doble de un número más 5\" → 2x + 5. \"Costo fijo de $200 más $15 por hora\" → C = 200 + 15h."},
          {n:8,title:"Productos notables y factorización",def:"Identidades para multiplicar y factorizar polinomios sin desarrollar paso a paso.",formula:"(a+b)² = a² + 2ab + b²\n(a−b)² = a² − 2ab + b²\n(a+b)(a−b) = a² − b²\nx² + (m+n)x + mn = (x+m)(x+n)",example:"Factorizar x²+5x+6: dos números que multipliquen 6 y sumen 5 → (x+2)(x+3)."},
          {n:9,title:"Ecuaciones lineales y cuadráticas",def:"Las lineales se despejan; las cuadráticas usan la fórmula general.",formula:"Lineal: 3x − 7 = 11 → x = 6\nCuadrática ax²+bx+c=0: x = [−b ± √(b²−4ac)] ÷ 2a",example:"x²−5x+6=0 → x = [5 ± √1]/2 → x₁=3, x₂=2. El discriminante (b²−4ac) indica el número de soluciones reales."},
          {n:10,title:"Sistemas de ecuaciones (2×2)",def:"Dos ecuaciones con dos incógnitas resueltas simultáneamente por suma y resta, sustitución o igualación.",example:"x + y = 10 ; x − y = 4. Sumando: 2x = 14 → x = 7; sustituyendo: y = 3."},
          {n:11,title:"Matemáticas financieras",def:"Cálculo de intereses sobre un capital.",formula:"Interés simple: I = C·i·t  (Monto M = C + I)\nInterés compuesto: M = C(1 + i)ⁿ",example:"$10,000 al 5% por 3 años: simple I = $1,500 (M=$11,500); compuesto M = 10000(1.05)³ = $11,576.25. El compuesto siempre produce más a largo plazo."}
        ]
      },
      {
        title: "Pensamiento aritmético",
        topics: [
          {n:12,title:"MCM y MCD",def:"Se obtienen descomponiendo los números en factores primos.",concepts:["<b>MCD:</b> factores comunes con su menor exponente. Sirve para simplificar fracciones.","<b>MCM:</b> comunes y no comunes con su mayor exponente. Sirve para sumar fracciones."],example:"12 = 2²·3 ; 18 = 2·3². MCD = 2·3 = 6 ; MCM = 2²·3² = 36."},
          {n:13,title:"Razones, proporciones y sucesiones",def:"Una razón compara por cociente (a/b); una proporción iguala dos razones (a/b = c/d).",concepts:["Proporción: se resuelve con productos cruzados (a·d = b·c).","Sucesión aritmética: se suma una constante. Geométrica: se multiplica por una constante."],example:"Si 3 lápices cuestan $12, 7 cuestan: 3/12 = 7/x → x = $28. La serie 2, 6, 18, 54 es geométrica (×3)."},
          {n:14,title:"Proporcionalidad y porcentajes",def:"Proporcionalidad directa (una sube, la otra sube) e inversa (una sube, la otra baja).",formula:"Porcentaje = (parte ÷ total) × 100",example:"15% de $240 = $36. Un artículo de $500 con 20% de descuento cuesta $400. Con proporcionalidad inversa: 4 obreros tardan 6 días → 8 obreros tardan 3 días."}
        ]
      },
      {
        title: "Pensamiento geométrico",
        topics: [
          {n:15,title:"Áreas y perímetros",def:"El perímetro es la suma de los lados; el área es la superficie interior.",formula:"Triángulo: A = (b·h)÷2\nRectángulo: A = b·h | Cuadrado: A = L²\nTrapecio: A = [(B+b)÷2]·h\nCírculo: A = π·r² | Circunferencia: P = 2π·r",example:"Trapecio de bases 10 y 6 y altura 4: A = [(10+6)/2]×4 = 32 cm²."},
          {n:16,title:"Semejanza y congruencia",def:"Triángulos congruentes: misma forma y tamaño (criterios LLL, LAL, ALA). Semejantes: misma forma, distinto tamaño con lados proporcionales.",example:"Lados 3,4,5 y 6,8,10 son semejantes: cada lado del segundo es el doble (razón 2)."},
          {n:17,title:"Teorema de Pitágoras",def:"En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.",formula:"c² = a² + b²",example:"Catetos 3 y 4: c = √(9+16) = √25 = 5. La hipotenusa es siempre el lado más largo."}
        ]
      },
      {
        title: "Pensamiento variacional (cálculo)",
        topics: [
          {n:18,title:"Intervalos, desigualdades y funciones",def:"Un intervalo representa los valores entre dos extremos. Corchete [ ] incluye; paréntesis ( ) excluye.",concepts:["2 ≤ x ≤ 5 → [2, 5] | 2 < x < 5 → (2, 5) | x ≥ 3 → [3, ∞).","En una gráfica: máximo (cima), mínimo (valle); creciente sube, decreciente baja; raíces o ceros cortan el eje X."],example:"−1 < x ≤ 4 se escribe (−1, 4]: el −1 se excluye y el 4 se incluye."},
          {n:19,title:"Límites, derivadas y optimización",def:"El cálculo estudia cómo cambian las cantidades. La derivada es la razón de cambio (pendiente de la tangente).",formula:"Límite (polinomios): sustitución directa\nRegla de la potencia: d/dx[xⁿ] = n·xⁿ⁻¹\nDerivada de una constante = 0",example:"lím(x→2)(x²+3) = 7. f(x)=3x³+5x²−7x+4 → f'(x)=9x²+10x−7. Optimizar: f'(x)=0 da los puntos críticos (máximos/mínimos)."}
        ]
      }
    ],
    quiz: []
  },

  digital: {
    title: "Cultura Digital",
    reactivos: "19 reactivos",
    guide: "assets/pdfs/guia_cultura_digital.pdf",
    intro: "19 reactivos de opción múltiple en 4 subáreas: Ciudadanía digital (5), Comunicación y colaboración (5), Creatividad digital (5) y Pensamiento algorítmico (4). El examen privilegia casos y ejemplos cotidianos sobre definiciones memorizadas.",
    subsections: [
      {
        title: "Ciudadanía digital",
        topics: [
          {n:20,title:"Identidad y huella digital",def:"La ciudadanía digital es el comportamiento responsable, ético y seguro en entornos digitales.",concepts:["<b>Datos personales:</b> nombre, fotos, correo, teléfono.","<b>Huella digital:</b> rastro que dejamos al navegar, publicar o comprar.","<b>Reputación digital:</b> opinión que otros se forman de lo que publicamos."],example:"Todo lo que publicas deja una huella difícil de borrar; piensa antes de compartir."},
          {n:21,title:"Licenciamiento de software",def:"Tipos de permisos de uso de los programas.",concepts:["<b>Freeware:</b> gratis pero no modificable (Adobe Reader).","<b>Shareware:</b> gratis por tiempo o funciones limitadas (versión de prueba).","<b>Software libre / código abierto:</b> usar, copiar y modificar (Linux, LibreOffice).","<b>Propietario:</b> se paga licencia y no se modifica (Windows, Office)."]},
          {n:22,title:"Amenazas y seguridad digital",def:"Riesgos en la red y medidas para protegerse.",concepts:["<b>Phishing:</b> correos o sitios falsos que roban datos.","<b>Grooming:</b> un adulto gana la confianza de un menor con fines de abuso.","<b>Malware:</b> software malicioso (virus, troyanos).","<b>Ransomware:</b> cifra archivos y exige un rescate.","<b>Medidas:</b> contraseñas fuertes, autenticación en dos factores (2FA), no abrir enlaces desconocidos, actualizar y respaldar."]}
        ]
      },
      {
        title: "Comunicación y colaboración digital",
        topics: [
          {n:23,title:"Ciberespacio y TICCAD",def:"El ciberespacio es el entorno virtual de las redes informáticas donde se interactúa sin presencia física.",concepts:["<b>TICCAD:</b> Tecnologías de la Información, Comunicación, Conocimiento y Aprendizaje Digitales.","Amplían las TIC al incluir el aprendizaje y la construcción del conocimiento.","<b>Servicios digitales:</b> almacenamiento en la nube (Drive, Dropbox), comercio electrónico (Amazon, Mercado Libre), educativos (Classroom, Moodle) y redes sociales.","<b>Métodos de investigación digital:</b> ciberetnografía, análisis de contenido en línea, focus group online y análisis de redes sociales."]},
          {n:24,title:"Herramientas digitales de colaboración",def:"Aplicaciones para trabajar, comunicar y aprender en línea.",concepts:["<b>Zoom / Meet:</b> videoconferencias.","<b>Google Docs / Drive:</b> edición colaborativa y almacenamiento en la nube.","<b>Canva:</b> diseño gráfico (carteles, infografías).","<b>Kahoot:</b> cuestionarios interactivos.","<b>Prezi / Genially:</b> presentaciones dinámicas."],example:"Para una videollamada usa Zoom; para una infografía, Canva; para un repaso lúdico, Kahoot."}
        ]
      },
      {
        title: "Creatividad digital",
        topics: [
          {n:25,title:"Hoja de cálculo",def:"Programas (Excel, Google Sheets) que organizan datos en filas y columnas. Toda fórmula inicia con =.",formula:"=SUMA(A1:A5) suma un rango\n=PROMEDIO(A1:A5) calcula la media\n=MAX() / =MIN() mayor / menor\n=SI(condición; valor1; valor2) decisión",example:"Promediar de B2 a B31: =PROMEDIO(B2:B31). =SI(A1>6;\"Aprobado\";\"Reprobado\") devuelve Aprobado si A1>6."},
          {n:26,title:"Método ADDIE y tecnologías emergentes",def:"ADDIE es un modelo para crear contenidos digitales.",concepts:["<b>A</b>nalizar → <b>D</b>iseñar → <b>D</b>esarrollar → <b>I</b>mplementar → <b>E</b>valuar.","<b>IA:</b> sistemas que imitan capacidades humanas (asistentes de voz).","<b>IoT:</b> objetos cotidianos conectados a internet.","<b>Ciencia de datos:</b> análisis de grandes volúmenes de datos."]},
          {n:27,title:"Ética digital y derechos de autor",def:"Normas de convivencia y respeto a la propiedad intelectual en la red.",concepts:["<b>Netiqueta:</b> cortesía en línea (no escribir en mayúsculas, citar fuentes, respetar).","<b>Brecha digital:</b> desigualdad en el acceso a la tecnología.","<b>Derechos de autor:</b> usar una obra sin permiso es plagio.","<b>Creative Commons:</b> BY (atribución), NC (no comercial), ND (sin derivadas), SA (compartir igual)."]}
        ]
      },
      {
        title: "Pensamiento algorítmico",
        topics: [
          {n:28,title:"Algoritmos y conceptos",def:"Un algoritmo es una secuencia ordenada y finita de pasos para resolver un problema.",concepts:["Debe ser <b>definido</b> (sin ambigüedad), <b>preciso</b> (orden exacto) y <b>finito</b> (termina).","<b>Variable:</b> espacio que guarda un valor que cambia. <b>Constante:</b> valor fijo.","<b>Operadores:</b> aritméticos (+ − × ÷), relacionales (>, <, =) y lógicos (Y, O, NO)."]},
          {n:29,title:"Diagramas de flujo",def:"Representación gráfica de un algoritmo mediante símbolos.",concepts:["<b>Óvalo:</b> inicio o fin.","<b>Rectángulo:</b> proceso o acción.","<b>Rombo:</b> decisión (verdadero/falso).","<b>Paralelogramo:</b> entrada o salida de datos.","<b>Flecha:</b> dirección del flujo."]},
          {n:30,title:"Estructuras de control y redes",def:"Formas de organizar el flujo de un algoritmo y conectar equipos.",concepts:["<b>Secuencial:</b> instrucciones una tras otra.","<b>Selectiva:</b> \"si… entonces… si no…\" decide un camino.","<b>Repetitiva:</b> \"mientras… repetir…\" (bucle o ciclo).","<b>Redes:</b> LAN (local), WAN (amplia; internet), WiFi (inalámbrica)."]}
        ]
      }
    ],
    quiz: []
  },

  historica: {
    title: "Conciencia Histórica",
    reactivos: "23 reactivos",
    guide: "assets/pdfs/guia_conciencia_historica.pdf",
    intro: "23 reactivos de opción múltiple en 3 subáreas: México antiguo y virreinal (8), Expansionismo capitalista (9) y Realidad actual (6). Evalúa causas, procesos y consecuencias, no solo fechas.",
    subsections: [
      {
        title: "Perspectivas del México antiguo y virreinal",
        topics: [
          {n:31,title:"Mesoamérica y Aridoamérica",def:"Antes de la conquista, el territorio se dividía en grandes áreas culturales.",concepts:["<b>Mesoamérica:</b> civilizaciones agrícolas sedentarias (olmecas, mayas, teotihuacanos, zapotecas, mexicas).","<b>Aridoamérica:</b> pueblos nómadas cazadores-recolectores (chichimecas).","<b>Olmeca:</b> cultura madre. <b>Maya:</b> escritura y el cero. <b>Mexica:</b> imperio con capital en Tenochtitlan y sistema de tributos."]},
          {n:32,title:"La conquista y la resistencia",def:"La conquista de México-Tenochtitlan (1519-1521) fue encabezada por Hernán Cortés.",concepts:["Su éxito se debió a: <b>alianzas indígenas</b> (tlaxcaltecas), <b>epidemias</b> (viruela), <b>tecnología</b> (caballos, pólvora, acero) y divisiones internas.","Cuauhtémoc fue el último tlatoani; Tenochtitlan cayó el 13 de agosto de 1521.","Resistencias: Guerra Chichimeca, Guerra de Castas de Yucatán (1847-1901), rebeliones yaquis."],example:"La conquista no fue solo militar: fue una alianza de pueblos contra los mexicas sumada a las epidemias."},
          {n:33,title:"La sociedad de la Nueva España",def:"El Virreinato (1535-1821) fue gobernado por un virrey en representación del rey de España. Sociedad estamental por origen étnico.",concepts:["<b>Peninsulares:</b> nacidos en España; altos cargos.","<b>Criollos:</b> hijos de españoles nacidos en América; riqueza pero poder limitado.","<b>Castas:</b> mezclas; posición intermedia.","<b>Indígenas</b> y <b>esclavos africanos:</b> base de la pirámide.","Economía: minería de plata, haciendas y comercio controlado por la metrópoli."]},
          {n:34,title:"Patrimonio e identidad cultural",def:"El mestizaje cultural dejó un rico patrimonio que perdura.",concepts:["Día de Muertos (Patrimonio Cultural Inmaterial, Unesco 2008).","Sincretismo religioso (Virgen de Guadalupe).","Tapetes de aserrín de Huamantla; el Palacio Nacional sobre el palacio de Moctezuma."]}
        ]
      },
      {
        title: "México durante el expansionismo capitalista",
        topics: [
          {n:35,title:"La Independencia (1810-1821)",def:"Movimiento causado por el descontento criollo, la Ilustración, las reformas borbónicas y la invasión napoleónica a España (detonante).",concepts:["<b>Hidalgo:</b> inicio (Grito de Dolores, 16 sep 1810).","<b>Morelos:</b> organización; Sentimientos de la Nación (1813).","<b>Iturbide:</b> consumación (1821) con el Plan de Iguala y el Ejército Trigarante (religión, independencia y unión)."]},
          {n:36,title:"Liberalismo y Reforma",def:"Tras la independencia, lucha entre conservadores (monarquía, Iglesia fuerte) y liberales (república, igualdad).",concepts:["Leyes de Reforma (1859-60) de Benito Juárez: separación Iglesia-Estado, nacionalización de bienes eclesiásticos, registro civil.","Constitución de 1857: derechos liberales."]},
          {n:37,title:"Intervenciones extranjeras del siglo XIX",def:"Conflictos que marcaron el territorio y la soberanía nacional.",concepts:["Guerra con Estados Unidos (1846-48): Tratado de Guadalupe Hidalgo; México perdió más de la mitad de su territorio.","Segunda Intervención Francesa (1862-67): Maximiliano de Habsburgo; fusilado en 1867.","Batalla de Puebla (5 de mayo de 1862): victoria mexicana contra Francia."]},
          {n:38,title:"El Porfiriato (1876-1911)",def:"Gobierno de Porfirio Díaz: modernización económica (ferrocarriles, inversión) pero desigualdad y represión. Lema: \"orden y progreso\".",concepts:["Oposición: el magonismo (Ricardo Flores Magón, Partido Liberal Mexicano, 1906).","Huelgas de Cananea (1906) y Río Blanco (1907), reprimidas.","Movimientos obreros del capitalismo industrial que influyeron en México: <b>ludismo</b> (destrucción de máquinas por temor al desempleo), <b>cartismo</b> (lucha obrera por derechos políticos) y el <b>anarquismo</b> y el <b>socialismo</b>."]},
          {n:39,title:"La Revolución Mexicana (1910-1920)",def:"Inició en 1910 con el Plan de San Luis de Madero contra la reelección de Díaz.",concepts:["<b>Zapatistas:</b> Plan de Ayala, \"Tierra y Libertad\".","<b>Villistas:</b> lucha del norte.","<b>Constitucionalistas (Carranza):</b> promovió la Constitución.","Constitución de 1917 (vigente): educación laica (Art. 3), tierra (Art. 27), derechos laborales (Art. 123)."]}
        ]
      },
      {
        title: "La realidad actual en perspectiva histórica",
        topics: [
          {n:40,title:"Posrevolución y presidencialismo",def:"Se construyó un sistema político centrado en el presidente.",concepts:["En 1929 se fundó el partido que sería el PRI; gobernó más de 70 años (partido hegemónico).","Expropiación petrolera de Lázaro Cárdenas (1938) y reparto agrario."]},
          {n:41,title:"México y los conflictos mundiales",def:"Participación de México en los grandes conflictos del siglo XX.",concepts:["Guerra Civil Española: México apoyó a la República y recibió exiliados (1939).","Segunda Guerra Mundial: del lado de los Aliados; el Escuadrón 201 combatió en el Pacífico."]},
          {n:42,title:"Del Estado interventor al neoliberalismo",def:"Cambio de modelo económico desde los años 80.",concepts:["El Estado intervino en la economía (empresas estatales) gran parte del siglo XX.","Tras la crisis de 1982 se adoptó el neoliberalismo: privatización, apertura comercial (TLCAN, 1994) y menor papel del Estado.","La globalización intensificó la interconexión mundial."]},
          {n:43,title:"La alternancia política",def:"Apertura gradual del sistema de partido hegemónico.",concepts:["La creación del IFE (hoy INE) dio certeza a las elecciones.","En el año 2000 el PRI perdió la presidencia tras 71 años (Vicente Fox, PAN).","Los medios y las redes sociales se volvieron actores centrales."]},
          {n:44,title:"Nociones del pensamiento histórico",def:"Cómo se construye e interpreta la historia.",concepts:["<b>Tiempo histórico:</b> procesos de larga duración vs. acontecimientos breves.","<b>Causalidad y multicausalidad:</b> todo hecho tiene varias causas y consecuencias.","<b>Fuentes:</b> primarias (de la época) y secundarias (estudios posteriores).","<b>Perspectiva:</b> un hecho se ve distinto según el punto de vista."]}
        ]
      }
    ],
    quiz: []
  },

  humanidades: {
    title: "Humanidades",
    reactivos: "20 reactivos",
    guide: "assets/pdfs/guia_humanidades.pdf",
    intro: "20 reactivos de opción múltiple. Abarca el pensamiento filosófico, la argumentación, la ética, la reflexión política, los desafíos contemporáneos y la experiencia estética. Premia la reflexión crítica más que la memorización.",
    subsections: [
      {
        title: "Fundamentos del pensamiento filosófico",
        topics: [
          {n:45,title:"¿Qué es la filosofía? Del mito al logos",def:"La filosofía (philos: amor, sophia: sabiduría) cuestiona de manera racional y crítica la realidad, el conocimiento y la existencia.",concepts:["<b>Mito:</b> explica con relatos sobrenaturales.","<b>Filosofía:</b> explica con razón y argumentación.","<b>Ciencia:</b> explica con el método experimental.","El \"paso del mito al logos\" ocurrió en la antigua Grecia."]},
          {n:46,title:"Ramas de la filosofía y conocimiento",def:"Disciplinas filosóficas y la distinción platónica del saber.",concepts:["<b>Metafísica/ontología:</b> el ser y la realidad. <b>Epistemología:</b> el conocimiento. <b>Ética:</b> la conducta moral. <b>Lógica:</b> el razonamiento. <b>Estética:</b> la belleza.","<b>Doxa:</b> opinión superficial. <b>Episteme:</b> conocimiento verdadero y justificado (Platón)."]},
          {n:47,title:"Pensamiento crítico y existencialismo",def:"El pensamiento crítico analiza y evalúa la información cuestionando supuestos y falacias.",concepts:["Implica preguntar \"¿por qué?\", buscar evidencias y considerar distintos puntos de vista.","<b>Existencialismo</b> (Sartre, Camus): \"la existencia precede a la esencia\"; el ser humano se construye con su libertad y responsabilidad."]}
        ]
      },
      {
        title: "La argumentación",
        topics: [
          {n:48,title:"Funciones de la lengua",def:"El lenguaje cumple distintas funciones según la intención.",concepts:["<b>Referencial:</b> informar (\"El agua hierve a 100 °C\").","<b>Emotiva:</b> expresar sentimientos (\"¡Qué alegría!\").","<b>Apelativa:</b> influir (\"Cierra la puerta\").","<b>Poética:</b> embellecer. <b>Fática:</b> verificar el canal. <b>Metalingüística:</b> hablar de la lengua."]},
          {n:49,title:"Estructura y tipos de argumento",def:"Un argumento justifica una afirmación mediante premisas y una conclusión.",concepts:["<b>Deductivo:</b> de lo general a lo particular; conclusión necesaria.","<b>Inductivo:</b> de casos particulares a una conclusión general probable.","<b>Analógico:</b> concluye por semejanza entre casos.","<b>Formas de diálogo:</b> mayéutica (método socrático de preguntas que \"dan a luz\" las ideas), ensayo (texto argumentativo donde el autor defiende una postura), debate y deliberación (decidir en común sopesando razones)."],example:"Todos los humanos son mortales; Sócrates es humano; luego Sócrates es mortal (deductivo)."},
          {n:50,title:"Falacias",def:"Una falacia es un argumento que parece válido pero no lo es. Reconocerlas es parte del pensamiento crítico.",concepts:["<b>Ad hominem:</b> atacar a la persona, no a su argumento.","<b>Ad populum:</b> \"todos lo creen, luego es verdad\".","<b>Ad verecundiam:</b> apelar a una autoridad no pertinente.","<b>Ad baculum:</b> usar amenazas. <b>Falsa causa:</b> A causó B solo porque ocurrió antes.","<b>Generalización apresurada:</b> concluir una regla general a partir de muy pocos casos."]}
        ]
      },
      {
        title: "La construcción de la persona: ética y valores",
        topics: [
          {n:51,title:"Ética, moral y teorías éticas",def:"La moral son las normas de una sociedad; la ética reflexiona sobre por qué algo es correcto.",concepts:["<b>Hedonismo:</b> el bien es el placer.","<b>Estoicismo:</b> virtud y autocontrol.","<b>Utilitarismo:</b> la mayor felicidad para el mayor número.","<b>Ética kantiana:</b> actuar por deber según principios universalizables."]},
          {n:52,title:"Valores y tipos de normas",def:"Los valores orientan la conducta hacia lo bueno o deseable (justicia, respeto, honestidad, solidaridad).",concepts:["<b>Morales:</b> de la conciencia; su incumplimiento genera remordimiento.","<b>Sociales:</b> de las costumbres; generan rechazo.","<b>Jurídicas:</b> del Estado; acarrean sanción legal.","<b>Religiosas:</b> de una fe; implican falta espiritual."]}
        ]
      },
      {
        title: "La reflexión política",
        topics: [
          {n:53,title:"Autonomía, heteronomía y discurso político",def:"Formas de relacionarse con las normas y con el poder.",concepts:["<b>Autonomía:</b> darse a sí mismo sus normas con libertad y razón.","<b>Heteronomía:</b> las normas vienen impuestas desde afuera.","El discurso político busca persuadir; conviene analizarlo para distinguir argumentos de manipulaciones (demagogia, falacias)."]}
        ]
      },
      {
        title: "Desafíos del mundo contemporáneo",
        topics: [
          {n:54,title:"Bioética",def:"Reflexiona sobre los problemas morales de los avances médicos (trasplantes, eutanasia, genética).",concepts:["<b>Autonomía:</b> respetar la decisión libre e informada del paciente.","<b>Beneficencia:</b> buscar el bien del paciente.","<b>No maleficencia:</b> \"primero, no dañar\".","<b>Justicia:</b> distribuir equitativamente los recursos."]},
          {n:55,title:"Sustentabilidad, género y alteridad",def:"Respuestas filosóficas a problemas actuales que buscan una convivencia justa.",concepts:["<b>Desarrollo sustentable:</b> satisface el presente sin comprometer a las generaciones futuras (económico, social, ambiental).","<b>Perspectiva de género:</b> los roles son construcciones sociales; patriarcado, micromachismos, equidad.","<b>Alteridad:</b> reconocer y respetar al \"otro\" como diferente y legítimo."]}
        ]
      },
      {
        title: "La experiencia estética y el arte",
        topics: [
          {n:56,title:"Categorías estéticas",def:"La estética estudia la belleza y la experiencia del arte; las categorías describen formas de valorar una obra.",concepts:["<b>Bello:</b> armonía y proporción.","<b>Sublime:</b> lo grandioso que sobrecoge.","<b>Trágico:</b> el sufrimiento y la fatalidad.","<b>Cómico:</b> lo que provoca risa. <b>Grotesco:</b> lo deforme y exagerado."]},
          {n:57,title:"Hermenéutica",def:"La hermenéutica es el arte y la teoría de la interpretación de textos y obras, buscando su sentido en su contexto.",example:"Una misma obra puede significar cosas distintas en épocas diferentes; interpretarla exige comprender su contexto histórico y cultural."},
          {n:58,title:"Filósofos y corrientes clave",def:"Aportaciones de los principales pensadores.",concepts:["<b>Sócrates:</b> mayéutica; \"solo sé que no sé nada\".","<b>Platón:</b> teoría de las ideas; doxa/episteme.","<b>Aristóteles:</b> lógica; ética del justo medio.","<b>Kant:</b> imperativo categórico. <b>Sartre:</b> existencialismo.","<b>Empirismo:</b> el saber viene de la experiencia. <b>Racionalismo:</b> de la razón."]}
        ]
      }
    ],
    quiz: []
  },

  naturales: {
    title: "Ciencias Naturales",
    reactivos: "32 reactivos",
    guide: "assets/pdfs/guia_ciencias_naturales.pdf",
    intro: "Es el área con más reactivos: 32 de opción múltiple. Integra química, física y biología en siete subáreas, desde el átomo hasta los ecosistemas, la célula y la evolución.",
    subsections: [
      {
        title: "La materia y sus interacciones",
        topics: [
          {n:59,title:"Átomo y enlaces químicos",def:"La materia tiene masa y ocupa espacio; su unidad es el átomo (protones +, neutrones, electrones −).",concepts:["<b>Iónico:</b> un metal cede electrones a un no metal (NaCl).","<b>Covalente:</b> dos no metales comparten electrones (H₂O).","<b>Metálico:</b> mar de electrones libres (cobre, hierro)."]},
          {n:60,title:"Estados y conservación de la materia",def:"La materia se presenta como sólido, líquido y gas según la temperatura.",concepts:["Cambios: fusión, evaporación, condensación, solidificación, sublimación.","<b>Ley de Lavoisier:</b> la materia no se crea ni se destruye; la masa de reactivos = masa de productos."]},
          {n:61,title:"Temperatura y ley de Coulomb",def:"Escalas para medir temperatura y fuerza entre cargas eléctricas.",formula:"°F = (°C × 9/5) + 32\nK = °C + 273\nLey de Coulomb: F = k·(q₁·q₂)/d²",example:"El agua se congela a 0 °C (273 K) y hierve a 100 °C (373 K). Cargas iguales se repelen; opuestas se atraen."}
        ]
      },
      {
        title: "La conservación de la energía",
        topics: [
          {n:62,title:"Tipos de energía",def:"La energía es la capacidad de realizar un trabajo y se manifiesta de muchas formas.",concepts:["Cinética (movimiento), potencial (posición), térmica, eléctrica, química, radiante, nuclear, eólica.","Renovables: solar, eólica, hidráulica, geotérmica. No renovables: petróleo, carbón, gas."],formula:"Energía cinética: Ec = ½·m·v²\nEnergía potencial: Ep = m·g·h  (g = 9.8 m/s²)"},
          {n:63,title:"Calor y temperatura",def:"La temperatura mide la agitación de las partículas; el calor es la energía que pasa de un cuerpo caliente a uno frío.",concepts:["<b>Calor específico:</b> energía para elevar 1 °C la temperatura de 1 g de sustancia.","El agua tiene calor específico alto: tarda en calentarse y enfriarse."]},
          {n:64,title:"Leyes de la termodinámica",def:"Principios que rigen la energía y el calor.",concepts:["<b>Ley cero:</b> equilibrio térmico (base del termómetro).","<b>Primera ley:</b> la energía se conserva; solo se transforma.","<b>Segunda ley:</b> la entropía (desorden) del universo siempre aumenta; el calor fluye del caliente al frío."]}
        ]
      },
      {
        title: "Los ecosistemas",
        topics: [
          {n:65,title:"Fotosíntesis y cadenas tróficas",def:"Flujo de materia y energía en los ecosistemas.",formula:"6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂",concepts:["Niveles: productores → consumidores (primarios, secundarios) → descomponedores.","En cada nivel solo pasa cerca del <b>10%</b> de la energía al siguiente."]},
          {n:66,title:"Biomas y ciclos biogeoquímicos",def:"Grandes regiones con clima y seres vivos característicos, y la circulación de los elementos.",concepts:["<b>Biomas:</b> tundra (frío extremo), sabana, bosque templado, selva (gran biodiversidad), desierto.","<b>Ciclos:</b> del carbono, del agua, del nitrógeno y del azufre.","<b>Servicios ambientales:</b> oxígeno, agua limpia, polinización, regulación del clima."]}
        ]
      },
      {
        title: "Las reacciones químicas",
        topics: [
          {n:67,title:"Masa molar y tipos de reacciones",def:"La masa molar es la masa de un mol de sustancia (suma de masas atómicas).",concepts:["<b>Síntesis:</b> A + B → AB.","<b>Descomposición:</b> AB → A + B.","<b>Sustitución:</b> un elemento reemplaza a otro.","<b>Redox:</b> transferencia de electrones."],example:"Agua (H₂O) = 2(1) + 16 = 18 g/mol."},
          {n:68,title:"Reacciones nucleares",def:"Procesos que liberan gran energía del núcleo atómico.",concepts:["<b>Fisión:</b> un núcleo pesado se divide en otros más ligeros (centrales nucleares).","<b>Fusión:</b> dos núcleos ligeros se unen (ocurre en el Sol)."]}
        ]
      },
      {
        title: "La energía en la vida diaria (física)",
        topics: [
          {n:69,title:"Caída libre y movimiento",def:"En la caída libre todos los cuerpos caen con la misma aceleración (g = 9.8 m/s²) sin importar su masa.",example:"Dos objetos de distinta masa en el vacío llegan al suelo al mismo tiempo."},
          {n:70,title:"Momento lineal y choques",def:"La cantidad de movimiento se conserva en los choques.",formula:"p = m · v",concepts:["<b>Choque elástico:</b> los objetos rebotan y se conserva la energía cinética.","<b>Choque inelástico:</b> quedan deformados o unidos y parte de la energía se disipa."]},
          {n:71,title:"Ondas electromagnéticas",def:"Ondas (luz, radio, microondas, rayos X, rayos gamma) que viajan a la velocidad de la luz sin necesitar un medio.",concepts:["El espectro electromagnético las ordena por frecuencia y longitud de onda.","La luz visible es solo una pequeña parte del espectro."]}
        ]
      },
      {
        title: "Los organismos y la célula",
        topics: [
          {n:72,title:"La célula y sus organelos",def:"La célula es la unidad básica de la vida: procariota (sin núcleo, bacterias) o eucariota (con núcleo).",concepts:["<b>Núcleo:</b> contiene el ADN. <b>Mitocondria:</b> produce energía (ATP).","<b>Cloroplasto</b> y <b>pared celular:</b> exclusivos de la célula vegetal.","<b>Ribosomas:</b> sintetizan proteínas. <b>Membrana:</b> regula lo que entra y sale."]},
          {n:73,title:"Niveles de organización y respiración celular",def:"La vida se organiza de lo simple a lo complejo y la célula obtiene energía de la glucosa.",concepts:["Átomo → molécula → célula → tejido → órgano → sistema → organismo → ecosistema → biosfera.","<b>Respiración celular:</b> glucólisis (citoplasma) → ciclo de Krebs y cadena respiratoria (mitocondria); requiere oxígeno."]}
        ]
      },
      {
        title: "La herencia y la evolución",
        topics: [
          {n:74,title:"Reproducción, cromosomas y genética",def:"La información genética está en el ADN, organizado en cromosomas (el ser humano tiene 46, 23 pares).",concepts:["<b>Asexual:</b> copias idénticas de un progenitor. <b>Sexual:</b> combina genes de dos, da variabilidad.","<b>Alelos:</b> versiones de un gen (dominante A o recesivo a). El cuadro de Punnett predice la descendencia."],example:"Cruce Aa × Aa → AA, Aa, Aa, aa: proporción 3:1; el rasgo recesivo (aa) aparece en 25%."},
          {n:75,title:"Teorías de la evolución",def:"Explicaciones del cambio de las especies.",concepts:["<b>Lamarck:</b> herencia de caracteres adquiridos por uso o desuso (superada).","<b>Darwin:</b> selección natural; sobreviven los mejor adaptados.","<b>Divergente:</b> ancestro común, rasgos distintos. <b>Convergente:</b> sin parentesco, rasgos similares (alas de aves e insectos)."]},
          {n:76,title:"El método científico",def:"Forma sistemática de investigar la realidad.",concepts:["Pasos: observación → pregunta → hipótesis → experimentación → análisis → conclusión.","<b>Variable independiente:</b> la que se cambia. <b>Dependiente:</b> la que se mide. <b>Controladas:</b> se mantienen constantes.","<b>Grupo control:</b> referencia sin tratamiento."]}
        ]
      }
    ],
    quiz: []
  },

  lengua: {
    title: "Lengua y Comunicación",
    reactivos: "31 reactivos",
    guide: "assets/pdfs/guia_lengua_comunicacion.pdf",
    intro: "31 reactivos de opción múltiple. Abarca el dominio del español (comprensión lectora, análisis literario, composición y formas orales) y los fundamentos del inglés. La mayoría se basa en la lectura comprensiva de textos.",
    subsections: [
      {
        title: "Comprensión lectora",
        topics: [
          {n:77,title:"Ideas y relaciones lógicas",def:"Comprender implica identificar la idea principal (sin la cual el texto pierde sentido) y las secundarias que la apoyan.",concepts:["<b>Causa-efecto:</b> porque, por lo tanto, en consecuencia.","<b>Contraste:</b> pero, sin embargo, aunque.","<b>Adición:</b> además, también, asimismo.","<b>Secuencia:</b> primero, después, finalmente."]},
          {n:78,title:"Organizar y resumir información",def:"Herramientas y niveles para procesar un texto.",concepts:["<b>Mapa conceptual:</b> ideas unidas por palabras enlace. <b>Cuadro sinóptico:</b> llaves de lo general a lo particular.","<b>Resumen:</b> condensa un texto. <b>Síntesis:</b> integra varias fuentes.","<b>Niveles de comprensión:</b> literal (explícito), inferencial (deduce) y crítico (evalúa).","<b>Tipos de texto según su intención:</b> resumen (condensa lo esencial), relato (narra hechos), reseña (describe y valora una obra) y comentario (expresa una opinión crítica)."]}
        ]
      },
      {
        title: "Análisis de textos literarios",
        topics: [
          {n:79,title:"Géneros y elementos de la narración",def:"Los textos literarios son narrativos (cuento, novela), líricos (poesía) y dramáticos (teatro).",concepts:["<b>Trama:</b> inicio, nudo (clímax) y desenlace.","<b>Personajes:</b> protagonista y antagonista.","<b>Tema:</b> idea central. <b>Ámbito:</b> lugar. <b>Tiempo:</b> época y orden."]},
          {n:80,title:"Tipos de narrador y tiempo narrativo",def:"Quién cuenta la historia y en qué orden.",concepts:["<b>Primera persona:</b> narra desde dentro (\"Yo caminaba…\").","<b>Tercera omnisciente:</b> lo sabe todo, incluso los pensamientos.","<b>Tercera observador:</b> narra solo lo que se ve.","<b>Lineal</b> (orden cronológico) o <b>retrospectivo</b> (flashback/analepsis)."]}
        ]
      },
      {
        title: "Composición y redacción",
        topics: [
          {n:81,title:"Etapas de escritura y fuentes",def:"Escribir un texto sigue etapas y se apoya en distintas fuentes.",concepts:["Etapas: planeación → redacción (borrador) → revisión y corrección → edición final.","<b>Primaria:</b> información de primera mano (entrevista, obra). <b>Secundaria:</b> analiza primarias (biografía). <b>Terciaria:</b> recopila (enciclopedia)."]},
          {n:82,title:"Acentuación",def:"La sílaba tónica es la de mayor intensidad. Reglas RAE.",concepts:["<b>Agudas:</b> tilde si terminan en n, s o vocal (café, canción).","<b>Graves:</b> tilde si NO terminan en n, s ni vocal (árbol, lápiz).","<b>Esdrújulas:</b> siempre tilde (médico, página).","<b>Sobreesdrújulas:</b> siempre tilde (dígamelo)."]},
          {n:83,title:"Sintaxis y propiedades textuales",def:"La oración tiene sujeto (núcleo sustantivo) y predicado (núcleo verbo).",concepts:["<b>Complementos:</b> directo (qué), indirecto (a quién), circunstancial (cómo, cuándo, dónde).","<b>Coherencia:</b> sentido y orden lógico. <b>Cohesión:</b> enlaces (conectores, pronombres). <b>Adecuación:</b> ajuste al destinatario."]}
        ]
      },
      {
        title: "Formas de comunicación oral",
        topics: [
          {n:84,title:"Exposición, diálogo, debate y mesa redonda",def:"Formas de comunicación oral según su estructura.",concepts:["<b>Exposición:</b> presentación organizada de un tema ante un público.","<b>Diálogo:</b> intercambio por turnos.","<b>Debate:</b> confrontación de posturas opuestas con reglas y moderador.","<b>Mesa redonda:</b> varios expertos exponen distintas perspectivas."]}
        ]
      },
      {
        title: "Inglés: gramática y tiempos verbales",
        topics: [
          {n:85,title:"Presente simple y continuo",def:"Tiempos para rutinas y para acciones en curso.",concepts:["<b>Present simple:</b> rutinas/hechos (I work, she works). Marcadores: always, every day.","<b>Present continuous:</b> acción ahora (I am working). Marcadores: now, at the moment."],example:"\"She is reading a book now\" (now → continuous)."},
          {n:86,title:"Pasado simple y continuo",def:"Tiempos para acciones terminadas o en progreso en el pasado.",concepts:["<b>Past simple:</b> acción terminada (I worked, she went). Marcadores: yesterday, last week.","<b>Past continuous:</b> acción en progreso (I was working, they were playing)."]},
          {n:87,title:"Futuro y tiempos perfectos",def:"Predicciones, planes y acciones con relación temporal.",concepts:["<b>Future (will):</b> predicciones y decisiones; be going to para planes.","<b>Present perfect:</b> have/has + participio (I have finished). Marcadores: already, yet, ever, just.","<b>Past perfect:</b> had + participio; acción anterior a otra pasada."]},
          {n:88,title:"Wh-, comparativos, modales y condicionales",def:"Preguntas, comparaciones, modos y estructuras condicionales y pasivas.",concepts:["<b>Wh-:</b> what (qué), who (quién), where (dónde), when (cuándo), why (por qué), whose (de quién).","<b>Comparativos:</b> tall→taller→the tallest; expensive→more expensive; good→better→the best.","<b>Modales:</b> can (habilidad), should (consejo), must (obligación).","<b>Condicionales:</b> 1.º real (If it rains, I will stay); 2.º hipotético (If I had money, I would travel). <b>Pasiva:</b> be + participio."]}
        ]
      }
    ],
    quiz: []
  },

  sociales: {
    title: "Ciencias Sociales",
    reactivos: "25 reactivos",
    guide: "assets/pdfs/guia_ciencias_sociales.pdf",
    intro: "25 reactivos de opción múltiple en tres subáreas: la organización económica, las perspectivas políticas y los problemas sociológicos. Busca comprender cómo se organiza la sociedad, el poder y la economía.",
    subsections: [
      {
        title: "La organización económica",
        topics: [
          {n:89,title:"Necesidades y factores de producción",def:"La economía estudia cómo se producen y distribuyen los bienes para satisfacer necesidades (vitales o no vitales).",concepts:["<b>Tierra:</b> recursos naturales.","<b>Trabajo:</b> esfuerzo humano.","<b>Capital:</b> maquinaria, dinero invertido.","<b>Tecnología/organización:</b> conocimiento para producir mejor."]},
          {n:90,title:"Sectores económicos",def:"Las actividades económicas se agrupan en tres sectores.",concepts:["<b>Primario:</b> extracción de recursos (agricultura, pesca, minería).","<b>Secundario:</b> transformación e industria (fábricas, construcción).","<b>Terciario:</b> servicios (comercio, turismo, educación)."]},
          {n:91,title:"Empleo, riqueza y modelos económicos",def:"Cómo se organiza el trabajo y se distribuye la riqueza.",concepts:["<b>Empleo formal:</b> registrado, con prestaciones. <b>Informal:</b> sin registro ni protección.","<b>Estado de bienestar:</b> el Estado garantiza servicios (salud, educación, pensiones).","<b>Neoliberalismo:</b> libre mercado, privatización y menor intervención estatal."]},
          {n:92,title:"Conceptos económicos básicos",def:"Nociones que aparecen con frecuencia en el examen.",concepts:["<b>Oferta:</b> lo que los productores ofrecen. <b>Demanda:</b> lo que los consumidores desean.","<b>Mercado:</b> donde se encuentran oferta y demanda y se fija el precio.","<b>Inflación:</b> aumento general y sostenido de precios. <b>PIB:</b> valor de todo lo producido en un año. <b>Impuestos:</b> aportaciones al Estado."]}
        ]
      },
      {
        title: "Las perspectivas políticas",
        topics: [
          {n:93,title:"Teorías del origen del Estado",def:"Pensadores contractualistas sobre el ser humano y el Estado.",concepts:["<b>Hobbes:</b> el ser humano es egoísta (\"el hombre es lobo del hombre\"); se necesita un Estado fuerte.","<b>Rousseau:</b> el ser humano es bueno; el Estado nace de un \"contrato social\".","<b>Locke:</b> el Estado debe proteger los derechos naturales (vida, libertad, propiedad)."]},
          {n:94,title:"Democracia y ciudadanía",def:"La democracia es el gobierno del pueblo, basado en elecciones libres, división de poderes y derechos.",concepts:["En México la ciudadanía se adquiere a los <b>18 años</b> (Art. 34): derechos (votar, ser votado) y obligaciones.","Los tres poderes: Ejecutivo (gobierna), Legislativo (hace leyes) y Judicial (imparte justicia).","<b>Poderes fácticos:</b> grupos que influyen en las decisiones sin haber sido electos (grandes empresas, medios, sindicatos, crimen organizado). Una democracia sana mantiene el poder formal —sujeto a la ley— por encima de ellos."]},
          {n:95,title:"Instituciones y política exterior",def:"Organismos del Estado mexicano y principios internacionales.",concepts:["<b>SEP:</b> educación. <b>Semarnat:</b> medio ambiente. <b>INE:</b> elecciones. <b>CNDH:</b> derechos humanos. <b>Cenapred:</b> prevención de desastres. <b>Inegi:</b> indicadores.","Política exterior: autodeterminación de los pueblos y no intervención.","Organismos: ONU (paz), Unesco (educación/cultura), FAO (alimentación), OIT (trabajo), OMS (salud).","<b>Teoría del sistema-mundo:</b> divide a los países en centro (ricos e industrializados), periferia (proveedores de materias primas) y semiperiferia (intermedios)."]}
        ]
      },
      {
        title: "Los problemas sociológicos",
        topics: [
          {n:96,title:"Organización social",def:"La sociedad se organiza en grupos que estudia la sociología.",concepts:["<b>Familia:</b> grupo primario básico. <b>Comunidad:</b> comparte territorio e identidad.","<b>Clases sociales:</b> según ingreso y posición.","La sociología estudia estas relaciones y estructuras."]},
          {n:97,title:"Desigualdad y discriminación",def:"Conceptos para analizar la exclusión social.",concepts:["<b>Estereotipo:</b> idea generalizada y simplificada de un grupo.","<b>Prejuicio:</b> juicio negativo previo sin fundamento.","<b>Discriminación:</b> trato desigual e injusto.","<b>Segregación:</b> separación o exclusión de un grupo."]},
          {n:98,title:"Crisis, movimientos e indicadores",def:"Las sociedades cambian por crisis y movimientos sociales, medibles con indicadores.",concepts:["Movimientos: estudiantil de 1968, EZLN (1994, derechos indígenas), feminista, ecologista.","<b>Migración:</b> movimiento de personas por causas económicas, políticas o ambientales.","<b>Indicadores</b> (Inegi, Coneval): pobreza, escolaridad, esperanza de vida, desempleo."]}
        ]
      }
    ],
    quiz: []
  }
};
