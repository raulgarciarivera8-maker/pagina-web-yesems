// ============================================================
//  VITRINA DEL TEMARIO  ·  YES EMS
//  ------------------------------------------------------------
//  Solo los TITULOS y la estructura: es lo que ve quien todavia no
//  ha pagado. Las definiciones, los conceptos, los ejemplos, los
//  examenes y los PDFs viven en MongoDB y los entrega la API
//  unicamente a quien tiene la suscripcion activa.
//
//  Antes este archivo llevaba el temario completo y quizzes.js los 98
//  examenes con sus respuestas correctas. Se servian a cualquier
//  visitante, asi que el candado del sitio era solo visual.
// ============================================================
window.modulesData = {
 "matematico": {
  "title": "Pensamiento Matemático",
  "intro": "30 reactivos de opción múltiple en 6 subáreas. Distribución aproximada: Estadístico (4), Probabilístico (3), Algebraico (8), Aritmético (5), Geométrico (4) y Variacional (6). Se permite calculadora científica no programable.",
  "subsections": [
   {
    "title": "Pensamiento estadístico",
    "topics": [
     {
      "n": 1,
      "title": "Tipos de variables y muestreo",
      "bloqueado": true
     },
     {
      "n": 2,
      "title": "Medidas de tendencia central",
      "bloqueado": true
     },
     {
      "n": 3,
      "title": "Medidas de dispersión",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Pensamiento probabilístico",
    "topics": [
     {
      "n": 4,
      "title": "Técnicas de conteo",
      "bloqueado": true
     },
     {
      "n": 5,
      "title": "Probabilidad simple (Laplace)",
      "bloqueado": true
     },
     {
      "n": 6,
      "title": "Probabilidad condicional y Bayes",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Pensamiento algebraico",
    "topics": [
     {
      "n": 7,
      "title": "Lenguaje y expresiones algebraicas",
      "bloqueado": true
     },
     {
      "n": 8,
      "title": "Productos notables y factorización",
      "bloqueado": true
     },
     {
      "n": 9,
      "title": "Ecuaciones lineales y cuadráticas",
      "bloqueado": true
     },
     {
      "n": 10,
      "title": "Sistemas de ecuaciones (2×2)",
      "bloqueado": true
     },
     {
      "n": 11,
      "title": "Matemáticas financieras",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Pensamiento aritmético",
    "topics": [
     {
      "n": 12,
      "title": "MCM y MCD",
      "bloqueado": true
     },
     {
      "n": 13,
      "title": "Razones, proporciones y sucesiones",
      "bloqueado": true
     },
     {
      "n": 14,
      "title": "Proporcionalidad y porcentajes",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Pensamiento geométrico",
    "topics": [
     {
      "n": 15,
      "title": "Áreas y perímetros",
      "bloqueado": true
     },
     {
      "n": 16,
      "title": "Semejanza y congruencia",
      "bloqueado": true
     },
     {
      "n": 17,
      "title": "Teorema de Pitágoras",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Pensamiento variacional (cálculo)",
    "topics": [
     {
      "n": 18,
      "title": "Intervalos, desigualdades y funciones",
      "bloqueado": true
     },
     {
      "n": 19,
      "title": "Límites, derivadas y optimización",
      "bloqueado": true
     }
    ]
   }
  ]
 },
 "digital": {
  "title": "Cultura Digital",
  "intro": "19 reactivos de opción múltiple en 4 subáreas: Ciudadanía digital (5), Comunicación y colaboración (5), Creatividad digital (5) y Pensamiento algorítmico (4). El examen privilegia casos y ejemplos cotidianos sobre definiciones memorizadas.",
  "subsections": [
   {
    "title": "Ciudadanía digital",
    "topics": [
     {
      "n": 20,
      "title": "Identidad y huella digital",
      "bloqueado": true
     },
     {
      "n": 21,
      "title": "Licenciamiento de software",
      "bloqueado": true
     },
     {
      "n": 22,
      "title": "Amenazas y seguridad digital",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Comunicación y colaboración digital",
    "topics": [
     {
      "n": 23,
      "title": "Ciberespacio y TICCAD",
      "bloqueado": true
     },
     {
      "n": 24,
      "title": "Herramientas digitales de colaboración",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Creatividad digital",
    "topics": [
     {
      "n": 25,
      "title": "Hoja de cálculo",
      "bloqueado": true
     },
     {
      "n": 26,
      "title": "Método ADDIE y tecnologías emergentes",
      "bloqueado": true
     },
     {
      "n": 27,
      "title": "Ética digital y derechos de autor",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Pensamiento algorítmico",
    "topics": [
     {
      "n": 28,
      "title": "Algoritmos y conceptos",
      "bloqueado": true
     },
     {
      "n": 29,
      "title": "Diagramas de flujo",
      "bloqueado": true
     },
     {
      "n": 30,
      "title": "Estructuras de control y redes",
      "bloqueado": true
     }
    ]
   }
  ]
 },
 "historica": {
  "title": "Conciencia Histórica",
  "intro": "23 reactivos de opción múltiple en 3 subáreas: México antiguo y virreinal (8), Expansionismo capitalista (9) y Realidad actual (6). Evalúa causas, procesos y consecuencias, no solo fechas.",
  "subsections": [
   {
    "title": "Perspectivas del México antiguo y virreinal",
    "topics": [
     {
      "n": 31,
      "title": "Mesoamérica y Aridoamérica",
      "bloqueado": true
     },
     {
      "n": 32,
      "title": "La conquista y la resistencia",
      "bloqueado": true
     },
     {
      "n": 33,
      "title": "La sociedad de la Nueva España",
      "bloqueado": true
     },
     {
      "n": 34,
      "title": "Patrimonio e identidad cultural",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "México durante el expansionismo capitalista",
    "topics": [
     {
      "n": 35,
      "title": "La Independencia (1810-1821)",
      "bloqueado": true
     },
     {
      "n": 36,
      "title": "Liberalismo y Reforma",
      "bloqueado": true
     },
     {
      "n": 37,
      "title": "Intervenciones extranjeras del siglo XIX",
      "bloqueado": true
     },
     {
      "n": 38,
      "title": "El Porfiriato (1876-1911)",
      "bloqueado": true
     },
     {
      "n": 39,
      "title": "La Revolución Mexicana (1910-1920)",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La realidad actual en perspectiva histórica",
    "topics": [
     {
      "n": 40,
      "title": "Posrevolución y presidencialismo",
      "bloqueado": true
     },
     {
      "n": 41,
      "title": "México y los conflictos mundiales",
      "bloqueado": true
     },
     {
      "n": 42,
      "title": "Del Estado interventor al neoliberalismo",
      "bloqueado": true
     },
     {
      "n": 43,
      "title": "La alternancia política",
      "bloqueado": true
     },
     {
      "n": 44,
      "title": "Nociones del pensamiento histórico",
      "bloqueado": true
     }
    ]
   }
  ]
 },
 "humanidades": {
  "title": "Humanidades",
  "intro": "20 reactivos de opción múltiple. Abarca el pensamiento filosófico, la argumentación, la ética, la reflexión política, los desafíos contemporáneos y la experiencia estética. Premia la reflexión crítica más que la memorización.",
  "subsections": [
   {
    "title": "Fundamentos del pensamiento filosófico",
    "topics": [
     {
      "n": 45,
      "title": "¿Qué es la filosofía? Del mito al logos",
      "bloqueado": true
     },
     {
      "n": 46,
      "title": "Ramas de la filosofía y conocimiento",
      "bloqueado": true
     },
     {
      "n": 47,
      "title": "Pensamiento crítico y existencialismo",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La argumentación",
    "topics": [
     {
      "n": 48,
      "title": "Funciones de la lengua",
      "bloqueado": true
     },
     {
      "n": 49,
      "title": "Estructura y tipos de argumento",
      "bloqueado": true
     },
     {
      "n": 50,
      "title": "Falacias",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La construcción de la persona: ética y valores",
    "topics": [
     {
      "n": 51,
      "title": "Ética, moral y teorías éticas",
      "bloqueado": true
     },
     {
      "n": 52,
      "title": "Valores y tipos de normas",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La reflexión política",
    "topics": [
     {
      "n": 53,
      "title": "Autonomía, heteronomía y discurso político",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Desafíos del mundo contemporáneo",
    "topics": [
     {
      "n": 54,
      "title": "Bioética",
      "bloqueado": true
     },
     {
      "n": 55,
      "title": "Sustentabilidad, género y alteridad",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La experiencia estética y el arte",
    "topics": [
     {
      "n": 56,
      "title": "Categorías estéticas",
      "bloqueado": true
     },
     {
      "n": 57,
      "title": "Hermenéutica",
      "bloqueado": true
     },
     {
      "n": 58,
      "title": "Filósofos y corrientes clave",
      "bloqueado": true
     }
    ]
   }
  ]
 },
 "naturales": {
  "title": "Ciencias Naturales",
  "intro": "Es el área con más reactivos: 32 de opción múltiple. Integra química, física y biología en siete subáreas, desde el átomo hasta los ecosistemas, la célula y la evolución.",
  "subsections": [
   {
    "title": "La materia y sus interacciones",
    "topics": [
     {
      "n": 59,
      "title": "Átomo y enlaces químicos",
      "bloqueado": true
     },
     {
      "n": 60,
      "title": "Estados y conservación de la materia",
      "bloqueado": true
     },
     {
      "n": 61,
      "title": "Temperatura y ley de Coulomb",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La conservación de la energía",
    "topics": [
     {
      "n": 62,
      "title": "Tipos de energía",
      "bloqueado": true
     },
     {
      "n": 63,
      "title": "Calor y temperatura",
      "bloqueado": true
     },
     {
      "n": 64,
      "title": "Leyes de la termodinámica",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Los ecosistemas",
    "topics": [
     {
      "n": 65,
      "title": "Fotosíntesis y cadenas tróficas",
      "bloqueado": true
     },
     {
      "n": 66,
      "title": "Biomas y ciclos biogeoquímicos",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Las reacciones químicas",
    "topics": [
     {
      "n": 67,
      "title": "Masa molar y tipos de reacciones",
      "bloqueado": true
     },
     {
      "n": 68,
      "title": "Reacciones nucleares",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La energía en la vida diaria (física)",
    "topics": [
     {
      "n": 69,
      "title": "Caída libre y movimiento",
      "bloqueado": true
     },
     {
      "n": 70,
      "title": "Momento lineal y choques",
      "bloqueado": true
     },
     {
      "n": 71,
      "title": "Ondas electromagnéticas",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Los organismos y la célula",
    "topics": [
     {
      "n": 72,
      "title": "La célula y sus organelos",
      "bloqueado": true
     },
     {
      "n": 73,
      "title": "Niveles de organización y respiración celular",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "La herencia y la evolución",
    "topics": [
     {
      "n": 74,
      "title": "Reproducción, cromosomas y genética",
      "bloqueado": true
     },
     {
      "n": 75,
      "title": "Teorías de la evolución",
      "bloqueado": true
     },
     {
      "n": 76,
      "title": "El método científico",
      "bloqueado": true
     }
    ]
   }
  ]
 },
 "lengua": {
  "title": "Lengua y Comunicación",
  "intro": "31 reactivos de opción múltiple. Abarca el dominio del español (comprensión lectora, análisis literario, composición y formas orales) y los fundamentos del inglés. La mayoría se basa en la lectura comprensiva de textos.",
  "subsections": [
   {
    "title": "Comprensión lectora",
    "topics": [
     {
      "n": 77,
      "title": "Ideas y relaciones lógicas",
      "bloqueado": true
     },
     {
      "n": 78,
      "title": "Organizar y resumir información",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Análisis de textos literarios",
    "topics": [
     {
      "n": 79,
      "title": "Géneros y elementos de la narración",
      "bloqueado": true
     },
     {
      "n": 80,
      "title": "Tipos de narrador y tiempo narrativo",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Composición y redacción",
    "topics": [
     {
      "n": 81,
      "title": "Etapas de escritura y fuentes",
      "bloqueado": true
     },
     {
      "n": 82,
      "title": "Acentuación",
      "bloqueado": true
     },
     {
      "n": 83,
      "title": "Sintaxis y propiedades textuales",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Formas de comunicación oral",
    "topics": [
     {
      "n": 84,
      "title": "Exposición, diálogo, debate y mesa redonda",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Inglés: gramática y tiempos verbales",
    "topics": [
     {
      "n": 85,
      "title": "Presente simple y continuo",
      "bloqueado": true
     },
     {
      "n": 86,
      "title": "Pasado simple y continuo",
      "bloqueado": true
     },
     {
      "n": 87,
      "title": "Futuro y tiempos perfectos",
      "bloqueado": true
     },
     {
      "n": 88,
      "title": "Wh-, comparativos, modales y condicionales",
      "bloqueado": true
     }
    ]
   }
  ]
 },
 "sociales": {
  "title": "Ciencias Sociales",
  "intro": "25 reactivos de opción múltiple en tres subáreas: la organización económica, las perspectivas políticas y los problemas sociológicos. Busca comprender cómo se organiza la sociedad, el poder y la economía.",
  "subsections": [
   {
    "title": "La organización económica",
    "topics": [
     {
      "n": 89,
      "title": "Necesidades y factores de producción",
      "bloqueado": true
     },
     {
      "n": 90,
      "title": "Sectores económicos",
      "bloqueado": true
     },
     {
      "n": 91,
      "title": "Empleo, riqueza y modelos económicos",
      "bloqueado": true
     },
     {
      "n": 92,
      "title": "Conceptos económicos básicos",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Las perspectivas políticas",
    "topics": [
     {
      "n": 93,
      "title": "Teorías del origen del Estado",
      "bloqueado": true
     },
     {
      "n": 94,
      "title": "Democracia y ciudadanía",
      "bloqueado": true
     },
     {
      "n": 95,
      "title": "Instituciones y política exterior",
      "bloqueado": true
     }
    ]
   },
   {
    "title": "Los problemas sociológicos",
    "topics": [
     {
      "n": 96,
      "title": "Organización social",
      "bloqueado": true
     },
     {
      "n": 97,
      "title": "Desigualdad y discriminación",
      "bloqueado": true
     },
     {
      "n": 98,
      "title": "Crisis, movimientos e indicadores",
      "bloqueado": true
     }
    ]
   }
  ]
 }
};
