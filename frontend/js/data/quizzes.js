// ============ EXÁMENES DE PRÁCTICA POR TEMA (ACREDITA-BACH) ============
// Reactivos oficiales extraídos de las guías de estudio CENEVAL.
// Formato: { q: pregunta, options: [["A","texto"],...], correct: "A", just: "explicación" }

window.topicQuizzes = {
  // ===== Pensamiento Matemático =====
  1: [
    {q:"¿Qué tipo de variable estadística es \"número de mascotas por hogar\"?",options:[["A","Continua"],["B","Discreta"],["C","Cualitativa"]],correct:"B",just:"Se cuenta con números enteros (0, 1, 2…); no admite valores intermedios."},
    {q:"¿Qué muestreo elige salones completos al azar dentro de una escuela?",options:[["A","Estratificado"],["B","Sistemático"],["C","Por conglomerados"]],correct:"C",just:"Se eligen grupos completos (conglomerados) al azar."}
  ],
  2: [
    {q:"Los datos 5, 7, 7, 9, 12 tienen como mediana:",options:[["A","7"],["B","8"],["C","9"]],correct:"A",just:"Ya están ordenados; el valor central (3.º de 5) es 7."},
    {q:"El promedio de 6, 7, 7, 8, 9, 10 es:",options:[["A","7.5"],["B","7.83"],["C","8.0"]],correct:"B",just:"La suma es 47; 47 ÷ 6 = 7.83."},
    {q:"¿Cuál es la moda del conjunto 3, 5, 5, 6, 9, 5, 8?",options:[["A","5"],["B","6"],["C","9"]],correct:"A",just:"El 5 aparece 3 veces, más que cualquier otro valor."}
  ],
  3: [
    {q:"La desviación estándar mide:",options:[["A","El valor más frecuente"],["B","Qué tan dispersos están los datos"],["C","El valor central"]],correct:"B",just:"Indica la separación promedio de los datos respecto de la media."}
  ],
  4: [
    {q:"¿De cuántas formas se pueden ordenar 4 personas en una fila?",options:[["A","12"],["B","16"],["C","24"]],correct:"C",just:"4! = 4×3×2×1 = 24 (permutaciones: importa el orden)."},
    {q:"¿Cuántas combinaciones de 3 elementos se forman de un conjunto de 6?",options:[["A","18"],["B","20"],["C","120"]],correct:"B",just:"C(6,3) = 720 ÷ 36 = 20 (no importa el orden)."}
  ],
  5: [
    {q:"Se lanzan dos dados. ¿Probabilidad de obtener suma igual a 7?",options:[["A","1/12"],["B","1/6"],["C","1/9"]],correct:"B",just:"De 36 resultados, 6 suman 7; P = 6/36 = 1/6."},
    {q:"En una bolsa hay 8 verdes de un total de 24 pelotas. ¿Probabilidad de verde?",options:[["A","12.5%"],["B","16.6%"],["C","33.3%"]],correct:"C",just:"P = 8/24 = 0.333 = 33.3%."},
    {q:"Se extrae una carta de una baraja de 52 (13 corazones). ¿Probabilidad de corazón?",options:[["A","1/13"],["B","1/4"],["C","1/2"]],correct:"B",just:"P = 13/52 = 1/4 = 25%."}
  ],
  6: [
    {q:"De 40 personas que hacen ejercicio, 30 tienen buena salud. ¿P(salud|ejercicio)?",options:[["A","30%"],["B","75%"],["C","40%"]],correct:"B",just:"P(A|B) = 30 ÷ 40 = 0.75 = 75%."}
  ],
  7: [
    {q:"Una renta de auto cuesta $2,500 fijos más $10 por km. Si el total fue $4,000:",options:[["A","500 + 10k = 4000"],["B","2500 + 10k = 4000"],["C","2500 + 50k = 4000"]],correct:"B",just:"Costo fijo (2500) + costo variable (10 por km) = total (4000)."}
  ],
  8: [
    {q:"Factoriza x² − 9.",options:[["A","(x−3)(x−3)"],["B","(x+3)(x−3)"],["C","(x+9)(x−1)"]],correct:"B",just:"Diferencia de cuadrados: a² − b² = (a+b)(a−b)."},
    {q:"Desarrolla (x − 5)².",options:[["A","x² − 25"],["B","x² − 10x + 25"],["C","x² + 10x + 25"]],correct:"B",just:"(a−b)² = a² − 2ab + b² = x² − 10x + 25."}
  ],
  9: [
    {q:"Las raíces de x² − 7x + 10 = 0 son:",options:[["A","2 y 5"],["B","1 y 10"],["C","−2 y −5"]],correct:"A",just:"Dos números que multiplican 10 y suman 7: 2 y 5."},
    {q:"Resolver 5x + 3 = 2x + 18.",options:[["A","x = 5"],["B","x = 3"],["C","x = 7"]],correct:"A",just:"5x − 2x = 18 − 3 → 3x = 15 → x = 5."}
  ],
  10: [
    {q:"En el sistema x + y = 12 ; 2x − y = 3, el valor de x es:",options:[["A","5"],["B","7"],["C","9"]],correct:"A",just:"Sumando ambas: 3x = 15 → x = 5 (y = 7)."}
  ],
  11: [
    {q:"Un capital de $8,000 a interés simple del 4% anual durante 2 años genera:",options:[["A","$320"],["B","$640"],["C","$800"]],correct:"B",just:"I = 8000 × 0.04 × 2 = $640."}
  ],
  12: [
    {q:"¿Cuál es el MCM de 6 y 8?",options:[["A","2"],["B","24"],["C","48"]],correct:"B",just:"6 = 2·3 ; 8 = 2³. MCM = 2³·3 = 24."},
    {q:"¿Cuál es el MCD de 24 y 36?",options:[["A","6"],["B","12"],["C","72"]],correct:"B",just:"24 = 2³·3 ; 36 = 2²·3². MCD = 2²·3 = 12."}
  ],
  13: [
    {q:"La sucesión 5, 10, 20, 40… es:",options:[["A","Aritmética de razón 5"],["B","Geométrica de razón 2"],["C","Aritmética de razón 10"]],correct:"B",just:"Cada término se multiplica por 2 (geométrica)."}
  ],
  14: [
    {q:"Si 4 obreros tardan 6 días, ¿cuántos días tardarían 8 obreros?",options:[["A","12 días"],["B","3 días"],["C","6 días"]],correct:"B",just:"Proporcionalidad inversa: 4×6 = 24; 24 ÷ 8 = 3 días."},
    {q:"¿Cuánto es el 30% de 250?",options:[["A","60"],["B","75"],["C","80"]],correct:"B",just:"0.30 × 250 = 75."}
  ],
  15: [
    {q:"¿Cuál es el área de un triángulo con base 12 cm y altura 5 cm?",options:[["A","60 cm²"],["B","30 cm²"],["C","17 cm²"]],correct:"B",just:"A = (12 × 5) ÷ 2 = 30 cm²."},
    {q:"El área de un círculo de radio 5 cm (π≈3.14) es aproximadamente:",options:[["A","31.4 cm²"],["B","78.5 cm²"],["C","157 cm²"]],correct:"B",just:"A = π·r² = 3.14 × 25 = 78.5 cm²."}
  ],
  16: [
    {q:"Dos triángulos con lados 2,3,4 y 4,6,8 son:",options:[["A","Congruentes"],["B","Semejantes"],["C","No relacionados"]],correct:"B",just:"Cada lado del segundo es el doble; misma forma, distinto tamaño."}
  ],
  17: [
    {q:"Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Su hipotenusa?",options:[["A","10 cm"],["B","12 cm"],["C","14 cm"]],correct:"A",just:"c = √(36 + 64) = √100 = 10 cm."}
  ],
  18: [
    {q:"El intervalo que representa la desigualdad −1 < x ≤ 4 es:",options:[["A","[−1, 4]"],["B","(−1, 4]"],["C","(−1, 4)"]],correct:"B",just:"El −1 se excluye (paréntesis) y el 4 se incluye (corchete)."},
    {q:"Si f(x) sube de izquierda a derecha en un tramo, ahí la función es:",options:[["A","Decreciente"],["B","Creciente"],["C","Constante"]],correct:"B",just:"Si los valores de y aumentan al avanzar en x, es creciente."}
  ],
  19: [
    {q:"¿Cuál es la derivada de f(x) = 4x² − 3x + 9?",options:[["A","8x − 3"],["B","8x − 3 + 9"],["C","4x − 3"]],correct:"A",just:"Derivada de 4x² = 8x; de −3x = −3; de 9 = 0."},
    {q:"lím (x→3) de (2x² − x) =",options:[["A","12"],["B","15"],["C","18"]],correct:"B",just:"Sustitución directa: 2(9) − 3 = 15."},
    {q:"En f(x) = x² − 8x, el punto crítico (f'(x)=0) está en:",options:[["A","x = 4"],["B","x = 8"],["C","x = 0"]],correct:"A",just:"f'(x) = 2x − 8 = 0 → x = 4."}
  ],

  // ===== Cultura Digital =====
  20: [
    {q:"El rastro que dejamos al navegar y publicar en internet se llama:",options:[["A","Huella digital"],["B","Malware"],["C","Firewall"]],correct:"A",just:"Es la huella digital, parte de la identidad digital."},
    {q:"La reputación digital se refiere a:",options:[["A","La opinión que otros se forman de ti en línea"],["B","El precio de tu dispositivo"],["C","Tu antivirus"]],correct:"A",just:"Es parte de la identidad digital."}
  ],
  21: [
    {q:"Linux y LibreOffice son ejemplos de software:",options:[["A","Propietario"],["B","De código abierto"],["C","Shareware"]],correct:"B",just:"Permiten estudiar y modificar su código fuente."},
    {q:"Una versión de prueba gratuita por 30 días es ejemplo de:",options:[["A","Freeware"],["B","Shareware"],["C","Software libre"]],correct:"B",just:"El shareware es gratis temporalmente y luego se paga."},
    {q:"¿Cuál es un ejemplo de software propietario?",options:[["A","Microsoft Windows"],["B","Linux"],["C","GIMP"]],correct:"A",just:"Requiere pagar licencia y no se modifica."}
  ],
  22: [
    {q:"Un correo que imita a tu banco y pide tu contraseña con urgencia es:",options:[["A","Ransomware"],["B","Phishing"],["C","Freeware"]],correct:"B",just:"El phishing suplanta entidades confiables para robar datos."},
    {q:"Un programa que cifra tus archivos y pide dinero para liberarlos es:",options:[["A","Phishing"],["B","Ransomware"],["C","Grooming"]],correct:"B",just:"\"Ransom\" significa rescate."},
    {q:"La medida más recomendable para proteger una cuenta es:",options:[["A","Usar la misma contraseña en todo"],["B","Autenticación en dos factores"],["C","Compartir la contraseña"]],correct:"B",just:"El 2FA añade una segunda barrera de seguridad."}
  ],
  23: [
    {q:"El entorno virtual donde las personas interactúan a través de redes es:",options:[["A","Hardware"],["B","Ciberespacio"],["C","Algoritmo"]],correct:"B",just:"El ciberespacio es el espacio intangible de las redes informáticas."},
    {q:"Las TICCAD incluyen, además de información y comunicación:",options:[["A","Conocimiento y aprendizaje"],["B","Hardware y software"],["C","Redes y cables"]],correct:"A",just:"Conocimiento y Aprendizaje Digitales son la \"CAD\"."}
  ],
  24: [
    {q:"¿Qué herramienta es la más adecuada para una videoconferencia?",options:[["A","Canva"],["B","Zoom"],["C","Kahoot"]],correct:"B",just:"Zoom (o Meet) está diseñado para reuniones por video."},
    {q:"Para diseñar una infografía atractiva conviene usar:",options:[["A","Canva"],["B","Zoom"],["C","Drive"]],correct:"A",just:"Canva es una herramienta de diseño gráfico."}
  ],
  25: [
    {q:"¿Qué fórmula calcula el promedio de las celdas C1 a C10?",options:[["A","=SUMA(C1:C10)"],["B","=PROMEDIO(C1:C10)"],["C","=MAX(C1:C10)"]],correct:"B",just:"PROMEDIO obtiene la media; SUMA totaliza y MAX da el mayor."},
    {q:"¿Qué función devuelve el valor más pequeño de un rango?",options:[["A","=MIN()"],["B","=MAX()"],["C","=SUMA()"]],correct:"A",just:"MIN da el valor mínimo."}
  ],
  26: [
    {q:"En el método ADDIE, \"medir resultados y mejorar\" corresponde a:",options:[["A","Analizar"],["B","Desarrollar"],["C","Evaluar"]],correct:"C",just:"Evaluar es la última fase: medir y retroalimentar."},
    {q:"Un asistente de voz que aprende de tus preferencias usa:",options:[["A","Inteligencia artificial"],["B","Ransomware"],["C","Shareware"]],correct:"A",just:"Imita capacidades humanas como aprender."},
    {q:"El refrigerador inteligente conectado a internet es ejemplo de:",options:[["A","Internet de las cosas"],["B","Ciencia de datos"],["C","Ransomware"]],correct:"A",just:"IoT conecta objetos cotidianos a la red."}
  ],
  27: [
    {q:"Escribir un mensaje TODO EN MAYÚSCULAS en un foro se interpreta como:",options:[["A","Gritar (falta de netiqueta)"],["B","Buena ortografía"],["C","Cifrado seguro"]],correct:"A",just:"Va contra la netiqueta."},
    {q:"La licencia Creative Commons que prohíbe el uso comercial es:",options:[["A","BY"],["B","NC"],["C","SA"]],correct:"B",just:"NC = No Comercial."},
    {q:"Copiar un texto de internet sin citar al autor es:",options:[["A","Plagio"],["B","Netiqueta"],["C","Respaldo"]],correct:"A",just:"Viola los derechos de autor."}
  ],
  28: [
    {q:"Una característica esencial de todo algoritmo es que sea:",options:[["A","Infinito"],["B","Ambiguo"],["C","Finito"]],correct:"C",just:"Debe terminar tras un número limitado de pasos."},
    {q:"Un operador relacional es:",options:[["A","+"],["B",">"],["C","Y (AND)"]],correct:"B",just:"\">\" compara valores; \"+\" es aritmético y \"Y\" es lógico."}
  ],
  29: [
    {q:"En un diagrama de flujo, el rombo representa:",options:[["A","Inicio o fin"],["B","Una decisión"],["C","Un proceso"]],correct:"B",just:"El rombo plantea una condición con dos caminos (verdadero/falso)."},
    {q:"El paralelogramo en un diagrama de flujo indica:",options:[["A","Entrada/salida de datos"],["B","Decisión"],["C","Inicio"]],correct:"A",just:"Representa leer o mostrar datos."}
  ],
  30: [
    {q:"La estructura \"Si… entonces… si no…\" es:",options:[["A","Selectiva"],["B","Repetitiva"],["C","Secuencial"]],correct:"A",just:"Decide entre caminos según una condición."},
    {q:"Internet es un ejemplo de red tipo:",options:[["A","LAN"],["B","WAN"],["C","Local"]],correct:"B",just:"Cubre grandes distancias (red de área amplia)."}
  ],

  // ===== Conciencia Histórica =====
  31: [
    {q:"Los olmecas son considerados la:",options:[["A","Cultura madre de Mesoamérica"],["B","Última civilización colonial"],["C","Cultura de Aridoamérica"]],correct:"A",just:"Influyeron en las culturas mesoamericanas posteriores."},
    {q:"Los pueblos nómadas del norte árido se conocían como:",options:[["A","Chichimecas"],["B","Mayas"],["C","Olmecas"]],correct:"A",just:"Habitaban Aridoamérica."}
  ],
  32: [
    {q:"¿Qué pueblo indígena se alió principalmente con Cortés contra los mexicas?",options:[["A","Los mayas"],["B","Los tlaxcaltecas"],["C","Los purépechas"]],correct:"B",just:"Los tlaxcaltecas, enemigos de los mexicas, fueron aliados clave."},
    {q:"La viruela influyó en la conquista porque:",options:[["A","Fortaleció a los mexicas"],["B","Diezmó a la población indígena sin defensas"],["C","Afectó solo a los españoles"]],correct:"B",just:"Las epidemias redujeron drásticamente a los nativos."}
  ],
  33: [
    {q:"En la sociedad novohispana, los hijos de españoles nacidos en América eran:",options:[["A","Peninsulares"],["B","Criollos"],["C","Castas"]],correct:"B",just:"Los criollos tenían riqueza pero poder político limitado."},
    {q:"La economía novohispana se basó principalmente en:",options:[["A","La minería de plata"],["B","El turismo"],["C","La industria automotriz"]],correct:"A",just:"La plata fue el motor económico colonial."}
  ],
  34: [
    {q:"El Día de Muertos fue reconocido por la Unesco como:",options:[["A","Patrimonio Cultural Inmaterial"],["B","Maravilla natural"],["C","Deporte nacional"]],correct:"A",just:"Declarado en 2008."},
    {q:"El sincretismo religioso se ejemplifica con:",options:[["A","La Virgen de Guadalupe"],["B","El TLCAN"],["C","El Escuadrón 201"]],correct:"A",just:"Fusión de creencias indígenas y católicas."}
  ],
  35: [
    {q:"El documento de Morelos que proponía la independencia y abolir la esclavitud fue:",options:[["A","El Plan de Ayala"],["B","Los Sentimientos de la Nación"],["C","El Plan de Iguala"]],correct:"B",just:"Los Sentimientos de la Nación (1813) sintetizaron su ideario."},
    {q:"El detonante inmediato de la Independencia fue:",options:[["A","La invasión napoleónica a España"],["B","El TLCAN"],["C","La Batalla de Puebla"]],correct:"A",just:"El vacío de poder de 1808 abrió la puerta al movimiento."}
  ],
  36: [
    {q:"Las Leyes de Reforma fueron impulsadas por:",options:[["A","Benito Juárez"],["B","Iturbide"],["C","Maximiliano"]],correct:"A",just:"Juárez encabezó el liberalismo reformista."},
    {q:"La separación Iglesia-Estado en México se logró con:",options:[["A","Las Leyes de Reforma"],["B","El Plan de Iguala"],["C","El TLCAN"]],correct:"A",just:"Impulsadas por Juárez (1859-60)."}
  ],
  37: [
    {q:"Con el Tratado de Guadalupe Hidalgo, México:",options:[["A","Ganó territorio"],["B","Perdió más de la mitad de su territorio"],["C","Se unió a Francia"]],correct:"B",just:"Cedió Alta California, Nuevo México y más."},
    {q:"La Batalla de Puebla (5 de mayo) se libró contra el ejército:",options:[["A","Francés"],["B","Estadounidense"],["C","Español"]],correct:"A",just:"Fue una victoria mexicana contra Francia en 1862."}
  ],
  38: [
    {q:"Las huelgas de Cananea y Río Blanco ocurrieron durante el:",options:[["A","Porfiriato"],["B","Virreinato"],["C","Imperio"]],correct:"A",just:"Fueron reprimidas por el régimen de Díaz."},
    {q:"El \"orden y progreso\" fue el lema del:",options:[["A","Porfiriato"],["B","Virreinato"],["C","Maderismo"]],correct:"A",just:"Resumía la política de Díaz."}
  ],
  39: [
    {q:"El lema \"Tierra y Libertad\" y el Plan de Ayala corresponden a:",options:[["A","Venustiano Carranza"],["B","Emiliano Zapata"],["C","Porfirio Díaz"]],correct:"B",just:"Zapata exigía el reparto agrario para los campesinos."},
    {q:"La Constitución de 1917 destaca por incluir:",options:[["A","Derechos sociales (educación, tierra, trabajo)"],["B","La monarquía"],["C","La esclavitud"]],correct:"A",just:"Fue pionera en derechos sociales."}
  ],
  40: [
    {q:"La expropiación petrolera de 1938 fue realizada por:",options:[["A","Lázaro Cárdenas"],["B","Porfirio Díaz"],["C","Vicente Fox"]],correct:"A",just:"Cárdenas nacionalizó el petróleo y creó Pemex."},
    {q:"El partido que gobernó más de 70 años fue el:",options:[["A","PRI"],["B","PAN"],["C","PRD"]],correct:"A",just:"Partido hegemónico del siglo XX."}
  ],
  41: [
    {q:"México recibió exiliados durante la:",options:[["A","Guerra Civil Española"],["B","Guerra de Castas"],["C","Conquista"]],correct:"A",just:"Acogió a republicanos españoles (1939)."},
    {q:"El Escuadrón 201 combatió en la:",options:[["A","Segunda Guerra Mundial"],["B","Guerra de Castas"],["C","Revolución"]],correct:"A",just:"México participó con los Aliados."}
  ],
  42: [
    {q:"El modelo neoliberal en México implicó:",options:[["A","Privatizaciones y apertura comercial"],["B","Más empresas estatales"],["C","Cierre de fronteras"]],correct:"A",just:"Reducción del Estado y libre mercado."},
    {q:"La crisis de deuda que aceleró el neoliberalismo fue la de:",options:[["A","1982"],["B","1521"],["C","1810"]],correct:"A",just:"La crisis de 1982."}
  ],
  43: [
    {q:"La alternancia política del año 2000 significó que:",options:[["A","Se prohibieron los partidos"],["B","El PRI perdió la presidencia tras décadas"],["C","México dejó de ser república"]],correct:"B",just:"Fue la primera derrota presidencial del PRI en 71 años."},
    {q:"El INE (antes IFE) se encarga de:",options:[["A","Organizar elecciones"],["B","Cobrar impuestos"],["C","Educar"]],correct:"A",just:"Da certeza a los procesos electorales."}
  ],
  44: [
    {q:"Una carta de un testigo de la Independencia es una fuente:",options:[["A","Primaria"],["B","Secundaria"],["C","Terciaria"]],correct:"A",just:"Proviene directamente de la época."},
    {q:"Que un hecho tenga varias causas se llama:",options:[["A","Multicausalidad"],["B","Permanencia"],["C","Sincretismo"]],correct:"A",just:"Causas políticas, económicas y sociales se combinan."}
  ],

  // ===== Humanidades =====
  45: [
    {q:"La filosofía se distingue del mito porque usa:",options:[["A","La razón y la argumentación"],["B","Relatos sobrenaturales"],["C","Experimentos de laboratorio"]],correct:"A",just:"Busca explicaciones racionales (el paso del mito al logos)."}
  ],
  46: [
    {q:"Una opinión superficial basada en la apariencia se denomina, según Platón:",options:[["A","Episteme"],["B","Doxa"],["C","Logos"]],correct:"B",just:"La doxa es opinión; la episteme es conocimiento justificado."},
    {q:"La rama de la filosofía que estudia el conocimiento es la:",options:[["A","Epistemología"],["B","Estética"],["C","Ética"]],correct:"A",just:"Estudia el origen y validez del conocimiento."}
  ],
  47: [
    {q:"La frase \"la existencia precede a la esencia\" pertenece al:",options:[["A","Existencialismo"],["B","Mito"],["C","Empirismo"]],correct:"A",just:"Es la tesis central del existencialismo."},
    {q:"Pedir evidencias y examinar premisas es parte del:",options:[["A","Pensamiento crítico"],["B","Mito"],["C","Prejuicio"]],correct:"A",just:"Evaluar con argumentos, no aceptar sin razones."}
  ],
  48: [
    {q:"\"¡Qué hermoso día!\" cumple la función del lenguaje:",options:[["A","Emotiva"],["B","Referencial"],["C","Fática"]],correct:"A",just:"Expresa un sentimiento del emisor."},
    {q:"\"¿Bueno? ¿Me escuchas?\" corresponde a la función:",options:[["A","Fática"],["B","Poética"],["C","Apelativa"]],correct:"A",just:"Verifica que el canal funcione."}
  ],
  49: [
    {q:"\"Todos los metales se dilatan; el hierro es metal; luego se dilata\" es un argumento:",options:[["A","Inductivo"],["B","Deductivo"],["C","Analógico"]],correct:"B",just:"Va de lo general a lo particular con conclusión necesaria."},
    {q:"Observar muchos cisnes blancos y concluir \"todos son blancos\" es:",options:[["A","Deductivo"],["B","Inductivo"],["C","Analógico"]],correct:"B",just:"De casos particulares a una generalización probable."}
  ],
  50: [
    {q:"Atacar a quien argumenta en vez de su idea es la falacia:",options:[["A","Ad hominem"],["B","Ad populum"],["C","Falsa causa"]],correct:"A",just:"Ataca a la persona, no al argumento."},
    {q:"\"Todos lo hacen, así que está bien\" es la falacia:",options:[["A","Ad populum"],["B","Ad baculum"],["C","Ad hominem"]],correct:"A",just:"Apela a la mayoría."}
  ],
  51: [
    {q:"\"Lo correcto es lo que produce mayor felicidad para el mayor número\" es el:",options:[["A","Hedonismo"],["B","Utilitarismo"],["C","Estoicismo"]],correct:"B",just:"El utilitarismo evalúa por las consecuencias para la mayoría."},
    {q:"El autocontrol y la serenidad ante lo inevitable caracterizan al:",options:[["A","Estoicismo"],["B","Hedonismo"],["C","Existencialismo"]],correct:"A",just:"Los estoicos valoraban la virtud y la calma."}
  ],
  52: [
    {q:"Una norma cuyo incumplimiento conlleva una sanción legal es:",options:[["A","Moral"],["B","Social"],["C","Jurídica"]],correct:"C",just:"Las normas jurídicas las impone el Estado."},
    {q:"Sentir remordimiento al incumplir una norma indica que es:",options:[["A","Moral"],["B","Jurídica"],["C","Social"]],correct:"A",just:"Las normas morales apelan a la conciencia."}
  ],
  53: [
    {q:"Decidir según las propias normas, con libertad y razón, es:",options:[["A","Heteronomía"],["B","Autonomía"],["C","Anomia"]],correct:"B",just:"Autonomía = darse a sí mismo la ley."}
  ],
  54: [
    {q:"El principio bioético de \"primero, no dañar\" es:",options:[["A","Justicia"],["B","No maleficencia"],["C","Autonomía"]],correct:"B",just:"No maleficencia: evitar causar daño."},
    {q:"Repartir recursos médicos de forma equitativa es el principio de:",options:[["A","Justicia"],["B","Autonomía"],["C","Beneficencia"]],correct:"A",just:"Justicia distributiva."}
  ],
  55: [
    {q:"El sistema de dominación masculina se denomina:",options:[["A","Patriarcado"],["B","Alteridad"],["C","Hermenéutica"]],correct:"A",just:"Patriarcado."},
    {q:"El reconocimiento y respeto del \"otro\" como diferente es:",options:[["A","Alteridad"],["B","Doxa"],["C","Mito"]],correct:"A",just:"Alteridad, base de la convivencia y la tolerancia."}
  ],
  56: [
    {q:"La categoría estética de lo grandioso que sobrecoge es lo:",options:[["A","Cómico"],["B","Sublime"],["C","Grotesco"]],correct:"B",just:"Lo sublime supera nuestra medida y nos sobrecoge."},
    {q:"El sufrimiento y la fatalidad inevitable en el arte es lo:",options:[["A","Trágico"],["B","Cómico"],["C","Bello"]],correct:"A",just:"Lo trágico."}
  ],
  57: [
    {q:"La teoría de la interpretación de textos es la:",options:[["A","Hermenéutica"],["B","Lógica"],["C","Estética"]],correct:"A",just:"Busca comprender el sentido de una obra en su contexto."}
  ],
  58: [
    {q:"La mayéutica y \"solo sé que no sé nada\" son de:",options:[["A","Sócrates"],["B","Kant"],["C","Sartre"]],correct:"A",just:"Sócrates."},
    {q:"El \"justo medio\" entre dos extremos es propio de la ética de:",options:[["A","Aristóteles"],["B","Epicuro"],["C","Sartre"]],correct:"A",just:"Ética de la virtud aristotélica."}
  ],

  // ===== Ciencias Naturales =====
  59: [
    {q:"El enlace de la sal común (NaCl), entre un metal y un no metal, es:",options:[["A","Covalente"],["B","Iónico"],["C","Metálico"]],correct:"B",just:"El sodio cede un electrón al cloro; se atraen por sus cargas."},
    {q:"El enlace del cobre metálico es:",options:[["A","Iónico"],["B","Metálico"],["C","Covalente"]],correct:"B",just:"Los metales comparten electrones libres."}
  ],
  60: [
    {q:"Según la ley de conservación de la materia, la masa de los productos es:",options:[["A","Mayor que la de los reactivos"],["B","Igual a la de los reactivos"],["C","Menor que la de los reactivos"]],correct:"B",just:"La materia solo se transforma; la masa total se conserva."},
    {q:"El paso de sólido a gas sin pasar por líquido es:",options:[["A","Sublimación"],["B","Fusión"],["C","Condensación"]],correct:"A",just:"Sublimación (ej. hielo seco)."}
  ],
  61: [
    {q:"25 °C equivalen a cuántos kelvin:",options:[["A","248 K"],["B","298 K"],["C","25 K"]],correct:"B",just:"K = 25 + 273 = 298."},
    {q:"Cargas eléctricas del mismo signo:",options:[["A","Se atraen"],["B","Se repelen"],["C","No interactúan"]],correct:"B",just:"Cargas iguales se repelen (ley de Coulomb)."}
  ],
  62: [
    {q:"La energía que posee un objeto por estar en movimiento es la energía:",options:[["A","Potencial"],["B","Cinética"],["C","Nuclear"]],correct:"B",just:"La energía cinética depende de la masa y la velocidad."},
    {q:"La energía del viento es la energía:",options:[["A","Eólica"],["B","Nuclear"],["C","Química"]],correct:"A",just:"Eólica (renovable)."}
  ],
  63: [
    {q:"El agua tiene un calor específico alto, por eso:",options:[["A","Tarda en calentarse y enfriarse"],["B","Hierve a 50 °C"],["C","No conduce calor"]],correct:"A",just:"Necesita mucha energía para cambiar de temperatura."}
  ],
  64: [
    {q:"\"La energía no se crea ni se destruye, solo se transforma\" es la:",options:[["A","Primera ley de la termodinámica"],["B","Ley de Coulomb"],["C","Segunda ley"]],correct:"A",just:"Es el principio de conservación de la energía."},
    {q:"La entropía del universo, según la 2ª ley, tiende a:",options:[["A","Aumentar"],["B","Disminuir"],["C","Mantenerse"]],correct:"A",just:"El desorden del universo siempre aumenta."}
  ],
  65: [
    {q:"En la fotosíntesis, las plantas liberan:",options:[["A","Dióxido de carbono"],["B","Oxígeno"],["C","Nitrógeno"]],correct:"B",just:"Producen glucosa y liberan oxígeno usando CO₂, agua y luz."},
    {q:"¿Qué porcentaje de energía pasa aproximadamente al siguiente nivel trófico?",options:[["A","10%"],["B","50%"],["C","90%"]],correct:"A",just:"Solo cerca del 10% se transfiere; el resto se pierde como calor."}
  ],
  66: [
    {q:"El bioma de frío extremo y suelo congelado es la:",options:[["A","Selva"],["B","Tundra"],["C","Sabana"]],correct:"B",just:"Tundra."},
    {q:"La polinización y el agua limpia son ejemplos de:",options:[["A","Servicios ambientales"],["B","Reacciones nucleares"],["C","Enlaces químicos"]],correct:"A",just:"Beneficios que la naturaleza brinda a la humanidad."}
  ],
  67: [
    {q:"AB → A + B es una reacción de:",options:[["A","Síntesis"],["B","Descomposición"],["C","Combustión"]],correct:"B",just:"Un compuesto se separa en sustancias más simples."},
    {q:"La masa molar del agua (H₂O) es:",options:[["A","18 g/mol"],["B","16 g/mol"],["C","2 g/mol"]],correct:"A",just:"2(1) + 16 = 18 g/mol."}
  ],
  68: [
    {q:"El proceso por el que el Sol produce energía uniendo núcleos ligeros es:",options:[["A","Fisión"],["B","Fusión"],["C","Combustión"]],correct:"B",just:"En la fusión nuclear se unen núcleos (hidrógeno → helio)."},
    {q:"La división de un núcleo pesado en otros más ligeros es:",options:[["A","Fusión"],["B","Fisión"],["C","Oxidación"]],correct:"B",just:"Fisión nuclear (centrales nucleares)."}
  ],
  69: [
    {q:"Dos objetos de distinta masa caen en el vacío. ¿Cuál llega primero?",options:[["A","El más pesado"],["B","El más ligero"],["C","Llegan al mismo tiempo"]],correct:"C",just:"En caída libre la aceleración es igual para todos (g)."}
  ],
  70: [
    {q:"La cantidad de movimiento se calcula como:",options:[["A","p = m·v"],["B","p = m·g·h"],["C","p = ½mv²"]],correct:"A",just:"Momento lineal = masa × velocidad."},
    {q:"En un choque elástico:",options:[["A","Los objetos quedan unidos"],["B","Se conserva la energía cinética"],["C","Se pierde toda la energía"]],correct:"B",just:"Los objetos rebotan conservando energía cinética."}
  ],
  71: [
    {q:"La luz visible forma parte del espectro:",options:[["A","Sonoro"],["B","Electromagnético"],["C","Mecánico"]],correct:"B",just:"Es una porción del espectro electromagnético."}
  ],
  72: [
    {q:"El organelo encargado de producir energía en la célula es:",options:[["A","El núcleo"],["B","La mitocondria"],["C","El ribosoma"]],correct:"B",just:"La mitocondria realiza la respiración celular."},
    {q:"La estructura presente en la célula vegetal pero NO en la animal es:",options:[["A","El núcleo"],["B","La mitocondria"],["C","El cloroplasto"]],correct:"C",just:"El cloroplasto y la pared celular son exclusivos de las plantas."}
  ],
  73: [
    {q:"La glucólisis ocurre en:",options:[["A","El citoplasma"],["B","El núcleo"],["C","La pared celular"]],correct:"A",just:"Divide la glucosa en 2 piruvatos en el citoplasma."},
    {q:"El orden correcto de menor a mayor complejidad es:",options:[["A","Célula, tejido, órgano"],["B","Órgano, célula, tejido"],["C","Tejido, célula, órgano"]],correct:"A",just:"Célula → tejido → órgano."}
  ],
  74: [
    {q:"Al cruzar Aa × Aa, ¿qué porcentaje muestra el rasgo recesivo (aa)?",options:[["A","25%"],["B","50%"],["C","75%"]],correct:"A",just:"Solo 1 de las 4 combinaciones es aa → 25%."},
    {q:"El ser humano tiene cuántos cromosomas:",options:[["A","23"],["B","46"],["C","48"]],correct:"B",just:"46 (23 pares)."}
  ],
  75: [
    {q:"La supervivencia de los mejor adaptados es la base de la teoría de:",options:[["A","Lamarck"],["B","Darwin (selección natural)"],["C","Mendel"]],correct:"B",just:"Darwin propuso la selección natural."},
    {q:"Alas de aves e insectos (especies sin parentesco) ilustran evolución:",options:[["A","Convergente"],["B","Divergente"],["C","Nula"]],correct:"A",just:"Rasgos similares por ambientes parecidos."}
  ],
  76: [
    {q:"La respuesta tentativa y comprobable en una investigación es la:",options:[["A","Hipótesis"],["B","Conclusión"],["C","Observación"]],correct:"A",just:"La hipótesis se pone a prueba."},
    {q:"El grupo sin tratamiento que sirve de comparación es el:",options:[["A","Grupo control"],["B","Grupo experimental"],["C","Grupo aleatorio"]],correct:"A",just:"Grupo control."}
  ],

  // ===== Lengua y Comunicación =====
  77: [
    {q:"El conector \"sin embargo\" indica una relación de:",options:[["A","Causa"],["B","Contraste"],["C","Adición"]],correct:"B",just:"Introduce una idea opuesta o contraria."},
    {q:"\"Por lo tanto\" expresa una relación de:",options:[["A","Causa-efecto"],["B","Contraste"],["C","Adición"]],correct:"A",just:"Introduce una consecuencia."}
  ],
  78: [
    {q:"El nivel de comprensión que deduce lo no explícito es el:",options:[["A","Inferencial"],["B","Literal"],["C","Ortográfico"]],correct:"A",just:"Infiere a partir del texto."},
    {q:"El resumen se diferencia de la síntesis porque:",options:[["A","El resumen condensa un texto; la síntesis integra varios"],["B","Son idénticos"],["C","El resumen es más largo"]],correct:"A",just:"La síntesis combina varias fuentes."}
  ],
  79: [
    {q:"El momento de mayor tensión en la trama se llama:",options:[["A","Desenlace"],["B","Nudo o clímax"],["C","Inicio"]],correct:"B",just:"El nudo o clímax es el punto culminante del conflicto."},
    {q:"La poesía pertenece al género:",options:[["A","Lírico"],["B","Narrativo"],["C","Dramático"]],correct:"A",just:"El género lírico expresa sentimientos."}
  ],
  80: [
    {q:"Un narrador que conoce los pensamientos de todos los personajes es:",options:[["A","Protagonista"],["B","Omnisciente"],["C","Testigo"]],correct:"B",just:"El omnisciente lo sabe todo."},
    {q:"Un relato con saltos al pasado usa tiempo:",options:[["A","Retrospectivo"],["B","Lineal"],["C","Circular"]],correct:"A",just:"Flashback o analepsis."}
  ],
  81: [
    {q:"Una entrevista original es una fuente:",options:[["A","Primaria"],["B","Secundaria"],["C","Terciaria"]],correct:"A",just:"Aporta información de primera mano."},
    {q:"Una enciclopedia es una fuente:",options:[["A","Terciaria"],["B","Primaria"],["C","Secundaria"]],correct:"A",just:"Recopila y organiza información."}
  ],
  82: [
    {q:"La palabra \"médico\" es:",options:[["A","Aguda"],["B","Grave"],["C","Esdrújula"]],correct:"C",just:"Acento en la antepenúltima; las esdrújulas siempre llevan tilde."},
    {q:"\"Café\" lleva tilde porque es aguda terminada en:",options:[["A","Vocal"],["B","Consonante r"],["C","z"]],correct:"A",just:"Agudas con tilde si terminan en n, s o vocal."}
  ],
  83: [
    {q:"El núcleo del predicado es un:",options:[["A","Verbo"],["B","Sustantivo"],["C","Adjetivo"]],correct:"A",just:"El verbo es el núcleo del predicado."},
    {q:"Que las ideas tengan orden lógico y sentido es:",options:[["A","Coherencia"],["B","Acentuación"],["C","Trama"]],correct:"A",just:"Coherencia textual."}
  ],
  84: [
    {q:"La confrontación organizada de dos posturas opuestas es un:",options:[["A","Debate"],["B","Monólogo"],["C","Resumen"]],correct:"A",just:"El debate enfrenta posturas con reglas y moderador."},
    {q:"Una mesa redonda se caracteriza porque:",options:[["A","Varios expertos exponen distintas perspectivas"],["B","Una sola persona habla"],["C","No hay público"]],correct:"A",just:"Reúne varias perspectivas de expertos."}
  ],
  85: [
    {q:"Choose the correct sentence (present continuous):",options:[["A","She is reading a book now."],["B","She read a book now."],["C","She reads now a book."]],correct:"A",just:"\"now\" indica acción en progreso → is + reading (-ing)."},
    {q:"\"I ___ to school every day.\" (present simple)",options:[["A","go"],["B","going"],["C","went"]],correct:"A",just:"Rutina → present simple: go."}
  ],
  86: [
    {q:"\"They ___ playing soccer when it rained.\" (past continuous)",options:[["A","were"],["B","was"],["C","are"]],correct:"A",just:"Plural → were + playing."},
    {q:"\"We ___ to the cinema last night.\" (past simple)",options:[["A","went"],["B","go"],["C","going"]],correct:"A",just:"\"last night\" → pasado: went."}
  ],
  87: [
    {q:"The past perfect: \"She ___ already left when I arrived.\"",options:[["A","has"],["B","had"],["C","was"]],correct:"B",just:"Past perfect = had + participio (had left)."},
    {q:"Present perfect: \"She ___ finished her homework.\"",options:[["A","has"],["B","have"],["C","had"]],correct:"A",just:"3.ª persona singular → has + participio."}
  ],
  88: [
    {q:"Comparative of \"big\":",options:[["A","bigger"],["B","more big"],["C","biggest"]],correct:"A",just:"Adjetivo corto → bigger."},
    {q:"\"___ is your teacher?\" (asks for a person)",options:[["A","Who"],["B","Where"],["C","When"]],correct:"A",just:"Who pregunta por persona."},
    {q:"\"If I had time, I ___ travel.\" (2nd conditional)",options:[["A","would"],["B","will"],["C","am"]],correct:"A",just:"2.º condicional: would + verbo."}
  ],

  // ===== Ciencias Sociales =====
  89: [
    {q:"La maquinaria y el dinero invertido son el factor:",options:[["A","Capital"],["B","Tierra"],["C","Trabajo"]],correct:"A",just:"El capital incluye maquinaria, herramientas y dinero invertido."},
    {q:"Los recursos naturales como factor de producción son la:",options:[["A","Tierra"],["B","Capital"],["C","Tecnología"]],correct:"A",just:"La tierra abarca suelo, agua y minerales."}
  ],
  90: [
    {q:"La agricultura y la pesca pertenecen al sector económico:",options:[["A","Primario"],["B","Secundario"],["C","Terciario"]],correct:"A",just:"El sector primario extrae recursos naturales."},
    {q:"El turismo y el comercio son del sector:",options:[["A","Terciario"],["B","Primario"],["C","Secundario"]],correct:"A",just:"Sector de servicios."}
  ],
  91: [
    {q:"Un empleo sin seguro social ni prestaciones de ley es:",options:[["A","Formal"],["B","Informal"],["C","Público"]],correct:"B",just:"El empleo informal no está registrado ni protegido."},
    {q:"El modelo en que el Estado garantiza salud y educación es el:",options:[["A","Estado de bienestar"],["B","Neoliberalismo"],["C","Feudalismo"]],correct:"A",just:"Estado de bienestar."}
  ],
  92: [
    {q:"El aumento general y sostenido de los precios es la:",options:[["A","Inflación"],["B","Oferta"],["C","Demanda"]],correct:"A",just:"Reduce el poder adquisitivo."},
    {q:"El valor de todo lo producido en un país en un año es el:",options:[["A","PIB"],["B","IVA"],["C","Salario"]],correct:"A",just:"Producto Interno Bruto."}
  ],
  93: [
    {q:"\"El hombre es lobo del hombre\" y un Estado fuerte es idea de:",options:[["A","Rousseau"],["B","Hobbes"],["C","Locke"]],correct:"B",just:"Hobbes veía al ser humano como egoísta y conflictivo."},
    {q:"El \"contrato social\" y la bondad natural del ser humano son ideas de:",options:[["A","Rousseau"],["B","Hobbes"],["C","Marx"]],correct:"A",just:"Rousseau."}
  ],
  94: [
    {q:"En México, la ciudadanía se obtiene a los:",options:[["A","15 años"],["B","18 años"],["C","21 años"]],correct:"B",just:"Según el Art. 34 constitucional, a los 18 años."},
    {q:"El poder que elabora las leyes es el:",options:[["A","Legislativo"],["B","Ejecutivo"],["C","Judicial"]],correct:"A",just:"El Congreso (Legislativo) hace las leyes."}
  ],
  95: [
    {q:"La institución que organiza las elecciones en México es:",options:[["A","El INE"],["B","La SEP"],["C","La OMS"]],correct:"A",just:"Instituto Nacional Electoral."},
    {q:"La Unesco se ocupa de:",options:[["A","Educación, ciencia y cultura"],["B","Alimentación"],["C","Comercio de armas"]],correct:"A",just:"Educación y cultura."}
  ],
  96: [
    {q:"El grupo social primario y básico es:",options:[["A","La familia"],["B","El Estado"],["C","La ONU"]],correct:"A",just:"La familia."},
    {q:"La sociología es la ciencia que estudia:",options:[["A","Las relaciones y estructuras sociales"],["B","Los astros"],["C","Las reacciones químicas"]],correct:"A",just:"La sociedad y sus grupos."}
  ],
  97: [
    {q:"Una idea generalizada y simplificada sobre un grupo es un:",options:[["A","Estereotipo"],["B","Indicador"],["C","Factor"]],correct:"A",just:"El estereotipo simplifica y generaliza."},
    {q:"El trato desigual e injusto hacia un grupo es:",options:[["A","Discriminación"],["B","Indicador"],["C","Capital"]],correct:"A",just:"Discriminación."}
  ],
  98: [
    {q:"El levantamiento del EZLN en 1994 reivindicó principalmente:",options:[["A","Los derechos de los pueblos indígenas"],["B","La privatización"],["C","La monarquía"]],correct:"A",just:"Demandó derechos y dignidad para los indígenas."},
    {q:"El organismo que mide la pobreza en México es el:",options:[["A","Coneval"],["B","INE"],["C","Semarnat"]],correct:"A",just:"Consejo Nacional de Evaluación."}
  ]
};

// Las guías de estudio se ofrecen completas a nivel de área (window.modulesData[area].guide).
window.topicPDFs = {};
