// Data: 80 temas EXANI-I, 5 áreas (extraído de la guía original).
window.modulesData = {
      cientifico: {
        title: "Pensamiento Científico",
        intro: "30 reactivos en tres subáreas de 10 reactivos cada una: identificación de variables, conceptos y procesos; relación de temas; e interpretación y argumentación científica.",
        subsections: [
          {
            title: "Identificación de variables, conceptos y procesos",
            topics: [
              {n:1,title:"Estructura y funciones de la célula",def:"La célula es la unidad estructural, funcional y de origen de todos los seres vivos (Teoría Celular de Schleiden, Schwann y Virchow, siglo XIX).",concepts:["<b>Célula procariota:</b> sin núcleo definido; ADN libre en el citoplasma (bacterias).","<b>Célula eucariota:</b> con núcleo y organelos membranosos (animales, plantas, hongos, protistas).","<b>Organelos:</b> núcleo (ADN), mitocondria (ATP), ribosomas (proteínas), retículo endoplásmico (transporte), aparato de Golgi (empaque), lisosomas (digestión), cloroplastos (fotosíntesis), membrana plasmática, pared celular."],example:"¿En qué organelo se produce la mayor parte del ATP? <b>Mitocondria.</b>"},
              {n:2,title:"Teoría de la evolución de Darwin",def:"Teoría de Charles Darwin (1859, El origen de las especies) que explica el cambio de las especies mediante la selección natural.",concepts:["<b>Variación:</b> diferencias heredables (mutaciones del ADN).","<b>Lucha por la existencia:</b> nacen más individuos de los que el ambiente sostiene.","<b>Selección natural:</b> los aptos sobreviven y se reproducen más.","<b>Adaptación:</b> acumulación de rasgos benéficos.","<b>Ancestro común:</b> todas las especies descienden de antepasados compartidos."],example:"Las jirafas con cuello más largo accedieron mejor al alimento alto y transmitieron ese rasgo."},
              {n:3,title:"La herencia en los seres vivos",def:"Proceso por el cual los caracteres biológicos pasan de padres a hijos a través de los genes. Gregor Mendel (1866) descubrió sus leyes con chícharos.",concepts:["<b>Gen:</b> unidad de información hereditaria.","<b>Alelo:</b> versión alternativa del gen (café/azul).","<b>Genotipo:</b> combinación de alelos (AA, Aa, aa).","<b>Fenotipo:</b> rasgo observable.","<b>Dominante (A) / Recesivo (a):</b> el dominante se expresa con una copia.","<b>Leyes de Mendel:</b> Uniformidad, Segregación, Distribución independiente."],formula:"Cruce Aa × Aa → 25% AA, 50% Aa, 25% aa (proporción fenotípica 3:1).",example:"Cuadro de Punnett para predecir cruces genéticos."},
              {n:4,title:"Biomoléculas: carbohidratos, lípidos y proteínas",def:"Moléculas orgánicas (C, H, O, y N, P, S) que componen y dan función a los seres vivos.",concepts:["<b>Carbohidratos:</b> (CH2O)n, energía rápida. Mono (glucosa), di (sacarosa), poli (almidón, glucógeno).","<b>Lípidos:</b> insolubles en agua, reserva energética, aislante, membranas, hormonas.","<b>Proteínas:</b> aminoácidos unidos por enlaces peptídicos. Función estructural, enzimática, transporte, defensa, hormonal."],example:"¿Cuál biomolécula sirve como reserva energética animal? <b>Lípidos / glucógeno.</b>"},
              {n:5,title:"Modelos atómicos",def:"Representaciones científicas de la estructura del átomo a lo largo de la historia.",concepts:["<b>Dalton (1808):</b> átomo indivisible, sólido.","<b>Thomson (1897):</b> pudín de pasas — esfera positiva con electrones.","<b>Rutherford (1911):</b> núcleo denso positivo con electrones girando.","<b>Bohr (1913):</b> electrones en órbitas con niveles de energía discretos.","<b>Schrödinger (1926):</b> orbitales como zonas de probabilidad.","<b>Chadwick (1932):</b> descubrimiento del neutrón."]},
              {n:6,title:"Tipos de enlaces químicos",def:"Fuerzas que mantienen unidos a los átomos. Cumplen la regla del octeto (8 electrones en la última capa).",concepts:["<b>Iónico:</b> transferencia metal-no metal (NaCl). Altos puntos de fusión, conduce en disolución.","<b>Covalente:</b> dos no metales comparten electrones. Simple (H-H), doble (O=O), triple (N≡N).","<b>Metálico:</b> mar de electrones libres — explica conductividad y maleabilidad."]},
              {n:7,title:"Estados de agregación de la materia",def:"Formas en que se presenta la materia según la cohesión de sus partículas.",concepts:["<b>Sólido:</b> forma y volumen definidos.","<b>Líquido:</b> volumen definido, forma del recipiente.","<b>Gas:</b> sin forma ni volumen definidos.","<b>Plasma:</b> gas ionizado a alta temperatura (Sol, rayos, neón).","<b>Cambios:</b> fusión, solidificación, vaporización, condensación, sublimación, deposición."]},
              {n:8,title:"Equilibrio, fricción y flotación",def:"Conceptos físicos sobre fuerzas en equilibrio o resistencia al movimiento.",concepts:["<b>Equilibrio:</b> ΣF = 0. Estático (reposo) o dinámico (velocidad constante).","<b>Fricción:</b> fuerza opuesta al movimiento.","<b>Flotación (Arquímedes):</b> empuje vertical = peso del fluido desalojado."],formula:"Fricción: F_r = μ·N | Empuje: E = ρ·V·g (densidad × volumen × gravedad)"}
            ]
          },
          {
            title: "Relación de temas y procesos del conocimiento científico",
            topics: [
              {n:9,title:"Electricidad y temperatura en sistemas biológicos",def:"Procesos eléctricos y térmicos que ocurren dentro de organismos vivos.",concepts:["Sistema nervioso transmite impulsos eléctricos (potenciales de acción).","Corazón genera actividad eléctrica (nodo sinoauricular), medible con ECG.","Temperatura corporal humana ≈ 37 °C; homeostasis por sudoración y vasodilatación.","Iones Na+, K+, Ca2+ generan impulsos en músculos y nervios."]},
              {n:10,title:"Ciencia y tecnología aplicadas a la salud",def:"Aplicaciones tecnológicas surgidas del método científico para mejorar la vida cotidiana y la salud.",concepts:["Vacunas (Pasteur, Jenner), antibióticos (Fleming 1928), rayos X (Röntgen 1895).","Resonancia, ultrasonido, marcapasos, prótesis, telemedicina.","Genoma humano (2003), CRISPR-Cas9, internet, smartphones.","Método científico: observación → hipótesis → experimentación → análisis → conclusión."]},
              {n:11,title:"Cambios y reacciones químicas",def:"Transformación de sustancias en otras nuevas con propiedades distintas (vs. cambio físico).",concepts:["<b>Indicadores:</b> cambio de color, gas, precipitado, temperatura, luz.","<b>Síntesis:</b> A + B → AB","<b>Descomposición:</b> AB → A + B","<b>Sustitución:</b> simple y doble","<b>Combustión:</b> + O2 → CO2 + H2O + energía","<b>Ley de Lavoisier:</b> la materia no se crea ni se destruye; las ecuaciones deben balancearse."]},
              {n:12,title:"Métodos de separación de mezclas",def:"Procedimientos físicos para separar componentes sin romper enlaces químicos.",concepts:["<b>Filtración:</b> sólido insoluble + líquido.","<b>Decantación:</b> líquidos no miscibles.","<b>Evaporación:</b> separa sólido disuelto (sal del mar).","<b>Destilación:</b> líquidos con distinto punto de ebullición.","<b>Cristalización, tamizado, imantación, centrifugación, cromatografía.</b>"]},
              {n:13,title:"Impacto ambiental y de salud por procesos químicos",def:"Consecuencias del uso de productos químicos en el ambiente y la salud humana.",concepts:["Lluvia ácida (SO2, NOx), efecto invernadero (CO2, CH4), agujero de ozono (CFC).","Contaminación por plaguicidas, metales pesados, plásticos, smog.","Enfermedades respiratorias, cáncer, pérdida de biodiversidad.","<b>Protocolo de Montreal (1987)</b> y <b>Acuerdo de París (2015).</b>"]},
              {n:14,title:"Manipulación genética y sus implicaciones",def:"Técnicas (ingeniería genética, ADN recombinante, CRISPR-Cas9) que modifican el material genético.",concepts:["Insulina humana en bacterias, maíz Bt, terapia génica, oveja Dolly (1996).","<b>Ética:</b> privacidad genética, bebés de diseño, riesgos OGM, patentes de vida.","Bioética para regulación responsable."]},
              {n:15,title:"Sistema solar y gravitación",def:"Sol + 8 planetas + planetas enanos + satélites + asteroides + cometas.",concepts:["<b>1a Ley de Kepler:</b> órbitas elípticas con el Sol en un foco.","<b>2a Ley:</b> áreas iguales en tiempos iguales.","<b>3a Ley:</b> T² ∝ R³.","<b>Gravitación Universal (Newton):</b> los cuerpos se atraen proporcional al producto de masas e inversamente al cuadrado de la distancia."],formula:"F = G·(m1·m2) / r²   (G = 6.674 × 10⁻¹¹ N·m²/kg²)"},
              {n:16,title:"Velocidad y aceleración",def:"Velocidad: rapidez con dirección. Aceleración: cambio de velocidad por unidad de tiempo.",concepts:["<b>MRU:</b> velocidad constante, a = 0.","<b>MRUA:</b> aceleración constante.","Caída libre: a = g ≈ 9.81 m/s²."],formula:"v = d / t  |  a = (v_f - v_i) / t  |  d = v_i·t + ½·a·t²  |  v_f² = v_i² + 2·a·d",example:"Auto de 0 a 27.78 m/s en 10 s → a ≈ 2.78 m/s²."},
              {n:17,title:"Avances tecnológicos en medición, transporte, industria y telecom",def:"Tecnologías modernas que transforman sectores clave de la sociedad.",concepts:["<b>Medición:</b> GPS, sensores láser, microscopios electrónicos.","<b>Transporte:</b> trenes alta velocidad, autos eléctricos, drones, cohetes reutilizables.","<b>Industria:</b> robótica, impresión 3D, IA (Industria 4.0).","<b>Telecom:</b> fibra óptica, 5G, satélites, IoT."]}
            ]
          },
          {
            title: "Interpretación y argumentación del conocimiento científico",
            topics: [
              {n:18,title:"Aporte calórico de los alimentos",def:"La kilocaloría (kcal) mide la energía que aporta un alimento.",concepts:["<b>Carbohidratos:</b> 4 kcal/g","<b>Proteínas:</b> 4 kcal/g","<b>Lípidos:</b> 9 kcal/g","<b>Alcohol:</b> 7 kcal/g","Adolescente: 1500/1800/2200 kcal/día según actividad."],example:"Manzana ≈ 95 kcal | Hamburguesa ≈ 540 kcal | Vaso de leche ≈ 150 kcal."},
              {n:19,title:"Composición química de sustancias puras y mezclas",def:"Las sustancias puras tienen composición fija; las mezclas combinan sustancias que conservan sus propiedades.",concepts:["<b>Sustancia pura:</b> elemento (oro) o compuesto (H2O, NaCl).","<b>Mezcla homogénea:</b> una sola fase (agua con azúcar, aire).","<b>Mezcla heterogénea:</b> fases distinguibles (agua + aceite, ensalada)."]},
              {n:20,title:"Energía potencial y cinética",def:"La energía cinética es la del movimiento; la potencial gravitatoria depende de la posición.",formula:"E_k = ½·m·v²  |  E_p = m·g·h  |  E_mecánica = E_k + E_p",example:"Pelota de 1 kg a 10 m: E_p = 1·9.81·10 ≈ 98.1 J. Al caer se convierte en cinética."},
              {n:21,title:"Intercambio de energía en reacciones químicas",def:"Las reacciones absorben o liberan energía conservando la energía total (Primera Ley de la Termodinámica).",concepts:["<b>Exotérmica:</b> libera energía (combustión, respiración celular).","<b>Endotérmica:</b> absorbe energía (fotosíntesis, cocción)."]},
              {n:22,title:"Sustancias conductoras de electricidad",def:"Materiales clasificados por su capacidad de conducir corriente eléctrica.",concepts:["<b>Conductores:</b> metales (Cu, Ag, Al), soluciones iónicas.","<b>Aislantes:</b> plástico, vidrio, madera seca, hule.","<b>Semiconductores:</b> silicio, germanio — base de la electrónica.","Compuestos iónicos disueltos conducen; covalentes no polares (azúcar) no."]},
              {n:23,title:"Manifestaciones y aplicaciones de la electricidad",def:"Fenómenos naturales y aplicaciones humanas de la corriente eléctrica.",concepts:["<b>Naturales:</b> rayos, electricidad estática, peces eléctricos, impulsos nerviosos.","<b>Aplicaciones:</b> alumbrado, motores, electrónica, medicina (desfibrilador), comunicaciones."],formula:"Ley de Ohm: V = I · R  (voltaje = corriente × resistencia)"},
              {n:24,title:"Biodiversidad en México: implicaciones éticas y culturales",def:"México es país megadiverso, ocupa el 5° lugar entre los 17 megadiversos.",concepts:["CONABIO: 1° en reptiles, 2° en mamíferos, 4° en anfibios y plantas. México tiene 10% de la biodiversidad mundial.","INALI: 68 lenguas indígenas + español, 364 variantes.","Cultivos originarios: maíz, frijol, chile, jitomate, aguacate, cacao.","Amenazas: deforestación, contaminación, tráfico de especies, cambio climático."]},
              {n:25,title:"Tecnología y avances del conocimiento científico",def:"La tecnología aplica el conocimiento científico; cada avance genera nuevas tecnologías.",concepts:["Telescopio → heliocentrismo (Galileo).","Microscopio → células y bacterias.","Computadoras → secuenciación ADN.","CRISPR → edición genética precisa."]},
              {n:26,title:"Adaptación y evolución: nutrición, reproducción y medio",def:"Mecanismos por los que los organismos sobreviven en su ambiente.",concepts:["<b>Adaptación:</b> camuflaje, hibernación, migración.","<b>Nutrición:</b> autótrofa (fotosíntesis) y heterótrofa (herbívoros, carnívoros, omnívoros, descomponedores).","<b>Reproducción:</b> sexual (variabilidad) y asexual (rapidez).","<b>Relaciones:</b> depredación, competencia, mutualismo, comensalismo, parasitismo."]},
              {n:27,title:"Transformación de energía en la cadena alimentaria",def:"La energía solar fluye por niveles tróficos: productores → consumidores → descomponedores.",concepts:["<b>Regla del 10%</b> (Lindeman, 1942): solo el 10% de la energía pasa al siguiente nivel.","El resto se pierde como calor.","Por eso las pirámides tróficas se angostan hacia arriba."]}
            ]
          }
        ],
        quiz: [
          {q:"¿En qué organelo se produce la mayor parte del ATP de la célula?",options:[["A","Ribosoma"],["B","Mitocondria"],["C","Aparato de Golgi"]],correct:"B",just:"La mitocondria es la 'central energética' celular: realiza la respiración celular y produce ATP."},
          {q:"¿Cuál es la fórmula correcta de la energía cinética?",options:[["A","E_k = m·g·h"],["B","E_k = ½·m·v²"],["C","E_k = F·d"]],correct:"B",just:"La energía cinética depende de la masa y el cuadrado de la velocidad: E_k = ½·m·v²."}
        ]
      },

      redaccion: {
        title: "Redacción Indirecta",
        intro: "30 reactivos. Evalúa la selección de fragmentos bien escritos (concordancia, cohesión, ortografía, registro). No es redacción libre — es identificar la opción correcta.",
        subsections: [
          {
            title: "Gramática y cohesión",
            topics: [
              {n:28,title:"Concordancia nominal: sustantivos, artículos, adjetivos, pronombres",def:"Sustantivo, artículo y adjetivo deben coincidir en género (M/F) y número (singular/plural).",concepts:["✓ 'Las casas blancas' (femenino plural).","✗ 'Las casas blanco'.","Pronombres también concuerdan: 'Juan estudia, él aprueba' / 'María estudia, ella aprueba'."]},
              {n:29,title:"Concordancia verbal: sujeto-verbo",def:"El verbo concuerda con el sujeto en número y persona.",concepts:["✓ 'Los niños juegan' / 'El niño juega'.","✗ 'Los niños juega'.","<b>Sujetos compuestos:</b> verbo en plural: 'Juan y Pedro corren'."]},
              {n:30,title:"Cohesión gramatical: correferencia y elipsis",def:"Mecanismos para evitar repeticiones y mantener referencias claras.",concepts:["<b>Correferencia:</b> 'María llegó tarde. Ella se disculpó.' (Ella = María).","<b>Elipsis:</b> 'Juan compró manzanas y Pedro [compró] peras'."]},
              {n:31,title:"Cohesión léxico-semántica: sinonimia y antonimia contextual",def:"Uso de palabras de significado similar u opuesto según el contexto.",concepts:["<b>Sinonimia:</b> bonito/hermoso. Evita repeticiones.","<b>Antonimia:</b> frío/caliente.","<b>Contextual:</b> 'Banco' puede ser asiento o entidad financiera."]},
              {n:32,title:"Marcadores textuales (conectores)",def:"Palabras o frases que conectan ideas y dan estructura al texto.",concepts:["<b>Adición:</b> además, también, asimismo.","<b>Contraste:</b> sin embargo, no obstante, pero, aunque.","<b>Causa:</b> porque, debido a, ya que.","<b>Consecuencia:</b> por lo tanto, así que.","<b>Orden:</b> primero, después, finalmente.","<b>Ejemplificación:</b> por ejemplo, tales como."]}
            ]
          },
          {
            title: "Ortografía y puntuación",
            topics: [
              {n:33,title:"Grafofonética: representaciones gráficas de fonemas",def:"Correspondencia entre sonidos (fonemas) y letras (grafemas).",concepts:["<b>b/v:</b> bello/vello.","<b>s/c/z:</b> casa/caza, ciento/siento.","<b>g/j:</b> gente/jefe.","<b>ll/y:</b> pollo/poyo (yeísmo).","<b>h muda:</b> hola/ola.","Diptongos, triptongos, hiatos."]},
              {n:34,title:"Puntuación: signos diversos",def:"Reglas de uso de signos de puntuación en español.",concepts:["<b>Punto (.):</b> cierra oraciones.","<b>Coma (,):</b> series, vocativos, aclaraciones.","<b>Punto y coma (;):</b> oraciones relacionadas.","<b>Dos puntos (:):</b> enumeraciones, ejemplos.","<b>Comillas:</b> citas, títulos.","<b>Paréntesis ( ):</b> aclaraciones.","<b>¿? ¡!:</b> en español se abren y cierran.","<b>Guion (-)</b> y <b>raya (—).</b>"]},
              {n:35,title:"Acentuación: reglas y excepciones",def:"La sílaba tónica es la de mayor intensidad. Reglas RAE-ASALE.",concepts:["<b>Agudas:</b> tilde si terminan en vocal, n o s (café, canción, además).","<b>Graves o llanas:</b> tilde si NO terminan en vocal, n o s (árbol, lápiz, fácil).","<b>Esdrújulas:</b> siempre tilde (pájaro, México, música).","<b>Sobreesdrújulas:</b> siempre tilde (cómpramelo).","<b>Excepciones:</b> hiatos (María, baúl), tilde diacrítica (tú/tu, él/el, sí/si, más/mas), agudas en -y no llevan tilde (convoy)."]}
            ]
          },
          {
            title: "Registro y géneros textuales",
            topics: [
              {n:36,title:"Registro lingüístico: carta formal y artículo científico",def:"Tipos textuales con registro y estructura específicas.",concepts:["<b>Carta formal:</b> lugar/fecha, destinatario, saludo (Estimado), cuerpo, despedida (Atentamente), firma. Lenguaje respetuoso, uso de 'usted'.","<b>Artículo científico:</b> estructura IMRyD (Introducción, Métodos, Resultados, Discusión). Lenguaje objetivo, en tercera persona, con citas."]},
              {n:37,title:"Género textual: monografía",def:"Texto académico expositivo-argumentativo que aborda un solo tema con profundidad usando fuentes documentales.",concepts:["<b>Estructura:</b> portada, índice, introducción, desarrollo (capítulos), conclusiones, bibliografía.","Lenguaje formal, objetivo, impersonal, con citas y notas al pie."]},
              {n:38,title:"Registro lingüístico: correo electrónico y crónica deportiva",def:"Géneros contemporáneos con características propias.",concepts:["<b>Correo electrónico:</b> remitente, destinatario, asunto, saludo, cuerpo, despedida, firma. Formal o informal.","<b>Crónica deportiva:</b> narra y comenta evento deportivo combinando hechos y opinión. Título, lead, desarrollo cronológico, análisis, cierre."]},
              {n:39,title:"Género textual: eslogan",def:"Frase breve, llamativa y memorable usada en publicidad, política o campañas sociales.",concepts:["Breve (5-10 palabras), original, fácil de recordar.","Usa rimas, juegos de palabras, aliteraciones.","Evoca emociones."]}
            ]
          }
        ],
        quiz: [
          {q:"¿Cuál oración tiene concordancia correcta?",options:[["A","Los niños juega en el parque"],["B","Las casas blancas son bonitas"],["C","La perro ladra fuerte"]],correct:"B",just:"'Las casas' (femenino plural) concuerda con 'blancas' (femenino plural)."},
          {q:"¿Cuál palabra está correctamente acentuada?",options:[["A","Exámenes"],["B","Examenes"],["C","Examénes"]],correct:"A",just:"'Exámenes' es esdrújula (tónica antepenúltima) y todas las esdrújulas llevan tilde."}
        ]
      },

      matematico: {
        title: "Pensamiento Matemático",
        intro: "40 reactivos — el área con más peso. Comprensión de lo matemático (24 reactivos: Conexiones, Estimación, Sentido numérico) y Matematización (16 reactivos: Desarrollo de usos, Lenguaje matemático, Resignificaciones).",
        subsections: [
          {
            title: "Comprensión de lo matemático · Conexiones",
            topics: [
              {n:40,title:"Productos notables",def:"Multiplicaciones algebraicas que se resuelven con reglas fijas sin desarrollar paso a paso.",formula:"(a+b)² = a² + 2ab + b²\n(a-b)² = a² - 2ab + b²\n(a+b)(a-b) = a² - b²\n(a+b)³ = a³ + 3a²b + 3ab² + b³\n(x+a)(x+b) = x² + (a+b)x + ab",example:"(x + 5)² = x² + 10x + 25"},
              {n:41,title:"Factorización",def:"Proceso inverso a multiplicar: expresar un polinomio como producto de factores.",concepts:["<b>Factor común:</b> 6x² + 9x = 3x(2x + 3)","<b>Diferencia de cuadrados:</b> a² - b² = (a+b)(a-b). Ej: x² - 16 = (x+4)(x-4)","<b>Trinomio cuadrado perfecto:</b> a² + 2ab + b² = (a+b)². Ej: x² + 6x + 9 = (x+3)²","<b>Trinomio x² + bx + c:</b> dos números que sumen b y multipliquen c. Ej: x² + 5x + 6 = (x+2)(x+3)"]},
              {n:42,title:"Funciones lineales y no lineales",def:"Relaciones entre variables representadas algebraica y gráficamente.",concepts:["<b>Lineal:</b> y = mx + b → gráfica recta. m = pendiente, b = ordenada al origen.","<b>Cuadrática:</b> y = ax² + bx + c → parábola.","<b>Exponencial, logarítmica, trigonométrica:</b> no lineales."],example:"y = 2x + 3 es lineal; y = x² es cuadrática."},
              {n:43,title:"Ángulos: propiedades geométricas",def:"Clasificación de ángulos por medida y por pareja.",concepts:["<b>Por medida:</b> agudo (<90°), recto (=90°), obtuso (>90°), llano (=180°), cóncavo (>180°), completo (=360°).","<b>Por pareja:</b> complementarios (90°), suplementarios (180°), opuestos por el vértice (iguales), adyacentes.","<b>Triángulos:</b> suma de ángulos interiores = 180°.","<b>Paralelas + secante:</b> alternos internos iguales, correspondientes iguales."]},
              {n:44,title:"Unidades de medida de capacidad",def:"La capacidad se mide en litros (L).",formula:"1 L = 1000 mL = 1 dm³\n1 kL = 1000 L | 1 hL = 100 L | 1 daL = 10 L\n1 dL = 0.1 L | 1 cL = 0.01 L | 1 mL = 0.001 L",example:"2500 mL = 2.5 L"},
              {n:45,title:"Probabilidad e incertidumbre",def:"Medida de la posibilidad de que ocurra un evento. Valor entre 0 (imposible) y 1 (seguro).",formula:"P(A) = casos favorables / casos posibles"},
              {n:46,title:"Medidas de tendencia central",def:"Estadísticos que resumen un conjunto de datos.",concepts:["<b>Media aritmética:</b> suma de datos / número de datos.","<b>Mediana:</b> valor central con datos ordenados.","<b>Moda:</b> dato más repetido."],example:"Datos 2, 3, 3, 5, 7 → media = 4, mediana = 3, moda = 3."}
            ]
          },
          {
            title: "Comprensión de lo matemático · Estimación",
            topics: [
              {n:47,title:"Binomio al cuadrado",def:"Refuerzo del tema 40 aplicado a estimaciones.",formula:"(a ± b)² = a² ± 2ab + b²",example:"(3x - 2)² = 9x² - 12x + 4"},
              {n:48,title:"Suma de cuadrados",def:"a² + b² NO se puede factorizar en los números reales (es irreducible).",concepts:["Solo en los complejos: a² + b² = (a + bi)(a - bi)","Importante distinguirla de la diferencia de cuadrados, que sí se factoriza."]},
              {n:49,title:"Potenciación",def:"Operación que multiplica una base por sí misma tantas veces como indica el exponente.",formula:"aⁿ = a · a · a · ... · a (n veces)",example:"2⁵ = 32  |  10³ = 1000"},
              {n:50,title:"Números racionales (representación gráfica)",def:"Números expresables como fracción a/b con a, b enteros y b ≠ 0.",concepts:["Incluyen enteros (5 = 5/1), fracciones (1/2, -3/4), decimales finitos o periódicos.","<b>Gráfica:</b> en la recta numérica, dividir cada unidad en partes iguales. 3/4 está entre 0 y 1."]},
              {n:51,title:"Estimación de distancia y unidades de longitud",def:"Unidades del Sistema Internacional para medir longitud.",formula:"1 km = 1000 m | 1 m = 100 cm = 1000 mm\n1 milla ≈ 1.609 km | 1 pulgada = 2.54 cm",example:"Persona ≈ 1.7 m | Paso ≈ 75 cm | Cuadra urbana ≈ 100 m"},
              {n:52,title:"Teorema de la desigualdad del triángulo",def:"La suma de dos lados cualesquiera es siempre mayor que el tercer lado.",formula:"a + b > c  ∧  a + c > b  ∧  b + c > a",example:"3, 4 y 7 NO forman triángulo (3+4=7). Sí forman: 4, 5 y 6."},
              {n:53,title:"Espacio muestral",def:"Conjunto de todos los resultados posibles de un experimento aleatorio (Ω o S).",concepts:["Moneda: Ω = {águila, sol}","Dado: Ω = {1, 2, 3, 4, 5, 6}","Dos monedas: Ω = {AA, AS, SA, SS}"]},
              {n:54,title:"Probabilidad clásica (Regla de Laplace)",def:"Cuando todos los resultados son igualmente posibles.",formula:"P(A) = n(A) / n(Ω)",example:"Número par en un dado: favorables = {2,4,6} = 3; posibles = 6; P = 3/6 = 0.5 = 50%"}
            ]
          },
          {
            title: "Comprensión de lo matemático · Sentido numérico",
            topics: [
              {n:55,title:"Máximo Común Divisor (MCD)",def:"Mayor número que divide exactamente a dos o más números.",concepts:["Método: descomponer en factores primos y multiplicar los <b>comunes con menor exponente</b>."],example:"MCD(12, 18) → 12 = 2²·3 ; 18 = 2·3² → MCD = 2·3 = 6"},
              {n:56,title:"Mínimo Común Múltiplo (mcm)",def:"Menor número divisible entre dos o más números.",concepts:["Método: descomponer en factores primos y multiplicar <b>comunes y no comunes con mayor exponente</b>.","Útil para sumar fracciones con diferente denominador."],example:"mcm(12, 18) → 2²·3² = 36"},
              {n:57,title:"Propiedades de la potenciación",def:"Reglas para operar con potencias.",formula:"aᵐ · aⁿ = aᵐ⁺ⁿ\naᵐ / aⁿ = aᵐ⁻ⁿ\n(aᵐ)ⁿ = aᵐ·ⁿ\n(a·b)ⁿ = aⁿ·bⁿ\na⁰ = 1 (si a ≠ 0)\na⁻ⁿ = 1/aⁿ"},
              {n:58,title:"Números decimales y fraccionarios",def:"Conversión entre fracciones y decimales.",concepts:["<b>Fracción → decimal:</b> dividir num/den. 3/4 = 0.75","<b>Decimal finito → fracción:</b> sobre 10, 100... y simplificar. 0.25 = 25/100 = 1/4","<b>Decimal periódico → fracción:</b> 0.333... = 1/3"]},
              {n:59,title:"Criterios de congruencia de triángulos",def:"Dos triángulos son congruentes si tienen la misma forma y tamaño.",concepts:["<b>LLL:</b> tres lados iguales.","<b>LAL:</b> dos lados y el ángulo entre ellos.","<b>ALA:</b> dos ángulos y el lado entre ellos.","<b>LLA:</b> solo en triángulos rectángulos."]},
              {n:60,title:"Medición de objetos",def:"Uso de instrumentos según la magnitud a medir.",concepts:["<b>Longitud:</b> regla, cinta métrica.","<b>Masa:</b> balanza.","<b>Volumen:</b> probeta.","<b>Temperatura:</b> termómetro.","<b>Tiempo:</b> cronómetro.","Toda medición tiene error: precisión vs. exactitud."]},
              {n:61,title:"Transformaciones geométricas",def:"Cambios de posición o forma de una figura en el plano.",concepts:["<b>Traslación:</b> mover sin rotar.","<b>Rotación:</b> girar alrededor de un punto.","<b>Reflexión (simetría axial):</b> voltear respecto a una recta.","<b>Homotecia:</b> ampliar o reducir.","Las isometrías preservan distancias."]},
              {n:62,title:"Probabilidad clásica (refuerzo numérico)",def:"Mismo concepto del tema 54 con enfoque de cálculo rápido.",example:"Urna con 3 rojas y 7 azules: P(roja) = 3/10 = 0.3 = 30%"},
              {n:63,title:"Frecuencia estadística",def:"Conteo y representación de datos.",concepts:["<b>Absoluta (fᵢ):</b> número de veces que aparece un dato.","<b>Relativa (hᵢ):</b> fᵢ / n.","<b>Acumulada (Fᵢ):</b> suma de frecuencias hasta ese dato.","Representación: tablas, barras, pastel, histogramas."]}
            ]
          },
          {
            title: "Matematización · Desarrollo de usos",
            topics: [
              {n:64,title:"Representación gráfica de funciones",def:"Graficar y = f(x) en el plano cartesiano (X horizontal, Y vertical).",concepts:["<b>Lineal:</b> recta. m positiva sube; negativa baja.","<b>Cuadrática:</b> parábola. a > 0 abre hacia arriba; a < 0 hacia abajo.","<b>Cúbica:</b> curva en forma de S."],example:"y = 2x + 1 → x=0 ⇒ y=1; x=1 ⇒ y=3. Unir puntos."},
              {n:65,title:"Área y perímetro",def:"Perímetro: suma de los lados. Área: superficie que ocupa una figura.",formula:"Cuadrado: P = 4L | A = L²\nRectángulo: P = 2(b+h) | A = b·h\nTriángulo: P = suma de lados | A = (b·h)/2\nCírculo: P = 2πr | A = πr²\nTrapecio: A = ((B+b)/2)·h"}
            ]
          },
          {
            title: "Matematización · Lenguaje matemático",
            topics: [
              {n:66,title:"Ecuaciones de primer grado",def:"Forma general: ax + b = 0. Se resuelve despejando x.",concepts:["Agrupar términos con x de un lado y constantes del otro.","Realizar operaciones.","Despejar x."],example:"3x + 5 = 20 → 3x = 15 → x = 5"},
              {n:67,title:"Binomios y polinomios",def:"Expresiones algebraicas de uno o varios términos.",concepts:["<b>Monomio:</b> un término (5x²).","<b>Binomio:</b> dos términos (3x + 4).","<b>Trinomio:</b> tres términos (x² + 5x + 6).","<b>Polinomio:</b> suma de varios monomios.","<b>Grado:</b> mayor exponente."]},
              {n:68,title:"Expresión algebraica de perímetro, área o volumen",def:"Modelar geometría con literales.",example:"Perímetro de rectángulo base x, altura x+2: P = 2x + 2(x+2) = 4x + 4\nÁrea de cuadrado lado (x+3): A = (x+3)² = x² + 6x + 9\nVolumen de cubo arista a: V = a³"},
              {n:69,title:"Teorema de Pitágoras",def:"En todo triángulo rectángulo, el cuadrado de la hipotenusa = suma de cuadrados de los catetos.",formula:"c² = a² + b²",example:"Catetos 3 y 4 → hipotenusa = √(9+16) = √25 = 5"},
              {n:70,title:"Probabilidad frecuencial vs. clásica",def:"Dos enfoques de la probabilidad.",concepts:["<b>Clásica (teórica):</b> sin experimentar, eventos equiprobables. P = favorables/posibles.","<b>Frecuencial (empírica):</b> repetir experimento y registrar frecuencia relativa.","<b>Ley de los Grandes Números:</b> a más repeticiones, más cerca de la teórica."]}
            ]
          },
          {
            title: "Matematización · Resignificaciones",
            topics: [
              {n:71,title:"Sistemas de ecuaciones",def:"Conjunto de dos o más ecuaciones con dos o más incógnitas resueltas simultáneamente.",concepts:["<b>Sustitución:</b> despejar una variable y sustituir.","<b>Igualación:</b> despejar la misma variable en ambas.","<b>Reducción (suma o resta):</b> multiplicar para eliminar una variable.","<b>Gráfico:</b> punto de intersección de las rectas."],example:"x + y = 10 ; x - y = 4 → sumando: 2x = 14 → x = 7, y = 3"}
            ]
          }
        ],
        quiz: [
          {q:"Simplifica mediante factorización: (x² - 9) / (x + 3)",options:[["A","x + 3"],["B","x - 3"],["C","x² - 3"]],correct:"B",just:"x² - 9 = (x+3)(x-3). Al dividir entre (x+3) queda x - 3."},
          {q:"¿Cuál es el desarrollo correcto de (x + 5)²?",options:[["A","x² + 25"],["B","x² + 10x + 25"],["C","x² + 5x + 25"]],correct:"B",just:"Binomio al cuadrado: (a+b)² = a² + 2ab + b². Aquí: x² + 2(5x) + 25."},
          {q:"Probabilidad de obtener un número par al lanzar un dado de 6 caras:",options:[["A","1/6"],["B","1/3"],["C","1/2"]],correct:"C",just:"Favorables {2,4,6} = 3; posibles = 6; P = 3/6 = 1/2 = 50%."}
        ]
      },

      ingles: {
        title: "Inglés — Nivel A2",
        intro: "30 reactivos DIAGNÓSTICOS que no afectan tu puntaje global. Nivel A2 del MCER: comprensión de textos cortos cotidianos, conectores básicos, ortografía y vocabulario funcional.",
        subsections: [
          {
            title: "Reading comprehension",
            topics: [
              {n:72,title:"Reconocimiento de la información principal de un texto",def:"Identify what the text is mainly about (main topic).",concepts:["<b>Strategy:</b> read title, first sentence, last sentence.","Ask: What is this text about?"],example:"Paragraph about healthy food → 'What is the text mainly about?' → <b>healthy eating habits.</b>"},
              {n:73,title:"Ubicación de información y detalles específicos",def:"Scan the text to find a specific data point (name, number, date).",concepts:["<b>Strategy:</b> scanning — look for key words from the question."],example:"'At what time does the train leave?' → search for time expressions (8:00 a.m.)."},
              {n:74,title:"Identificación de las ideas principales de un texto",def:"Identify main idea of each paragraph (one text may have several).",concepts:["The main idea usually appears in the <b>first sentence (topic sentence)</b> of each paragraph."]},
              {n:75,title:"Identificación de información específica",def:"Recognize facts, opinions or descriptions explicitly stated.",concepts:["<b>Question types:</b> True/False, multiple choice (Who? Where? Why?)."]},
              {n:76,title:"Reconocimiento de la línea argumentativa",def:"Follow the author's reasoning: introduction → arguments → conclusion.",concepts:["Identify the <b>purpose</b>: to inform, persuade, describe, narrate, instruct."]}
            ]
          },
          {
            title: "Grammar and vocabulary",
            topics: [
              {n:77,title:"Uso de conectores sencillos",def:"Connectors A2 to join simple sentences.",concepts:["<b>Addition:</b> and, also, too, as well as.","<b>Contrast:</b> but, however, although.","<b>Cause:</b> because, since.","<b>Consequence:</b> so, therefore.","<b>Time:</b> first, then, after that, finally.","<b>Example:</b> for example, such as."],example:"'I like apples <b>and</b> oranges, <b>but</b> I don't like bananas.'"},
              {n:78,title:"Reconstrucción de una oración simple",def:"Order scrambled words into a grammatical English sentence.",formula:"Basic order: Subject + Verb + Object (+ Time/Place)",example:"'yesterday / went / I / to / the / park' → 'I went to the park yesterday.'"},
              {n:79,title:"Vocabulario y expresiones de uso cotidiano",def:"Daily-life A2 vocabulary.",concepts:["<b>Family:</b> mother, father, sister.","<b>Food:</b> bread, milk, fruit.","<b>House:</b> kitchen, bedroom.","<b>School:</b> teacher, book.","<b>Weather:</b> sunny, rainy.","<b>Time:</b> today, tomorrow, last week.","<b>Feelings:</b> happy, tired."],example:"<b>Expressions:</b> 'How are you?', 'What time is it?', 'Can I help you?', 'I'd like...', 'Excuse me', 'Thank you', 'Nice to meet you.'"},
              {n:80,title:"Reglas ortográficas y de puntuación en inglés",def:"Spelling and punctuation rules in English.",concepts:["Capitalize: <b>I</b> (pronoun), proper nouns, days, months, languages, nationalities.","<b>Apostrophe ':</b> contractions (don't, I'm) and possessive (John's book).","<b>Plural:</b> +s (cats); +es after s, x, z, ch, sh (boxes); -y → -ies (city → cities).","<b>3rd person singular:</b> he/she/it + s.","Punctuation only at the end, not at the beginning as in Spanish."]}
            ]
          }
        ],
        quiz: [
          {q:"Complete: 'Yesterday, Sofia _______ to the library to read a book.'",options:[["A","goes"],["B","went"],["C","gone"]],correct:"B",just:"'Yesterday' requires simple past. The past form of 'go' is 'went'."},
          {q:"Choose the correct connector: 'I was tired, _______ I went to bed early.'",options:[["A","because"],["B","but"],["C","so"]],correct:"C",just:"'So' expresses consequence — tired (cause) → went to bed early (consequence)."}
        ]
      },

      lectora: {
        title: "Comprensión Lectora",
        intro: "30 reactivos. Evalúa tu capacidad para identificar ideas principales, detalles, inferir, valorar y argumentar a partir de textos académicos, literarios y de participación social.",
        subsections: [
          {
            title: "Ámbitos de lectura del EXANI-I",
            topics: [
              {n:"E1",title:"Ámbito de estudio: textos académicos",def:"Artículos de investigación y ensayos académicos.",concepts:["Localización de información explícita.","Comprensión de ideas centrales.","Identificación de la tesis y argumentos del autor.","Reconocimiento de definiciones, ejemplos y datos clave."]},
              {n:"E2",title:"Ámbito literario: cuentos y ensayos",def:"Interpretación de mensajes, símbolos y temas de obras literarias.",concepts:["Identificar narrador, personajes, espacio y tiempo.","Reconocer figuras retóricas (metáfora, símil, personificación).","Inferir el tema o moraleja.","Distinguir realidad y ficción en el texto."]},
              {n:"E3",title:"Ámbito de participación social: convocatorias y noticias",def:"Comprensión de textos informativos y normativos del entorno público.",concepts:["Identificar el propósito comunicativo (informar, convocar, regular).","Reconocer requisitos, fechas y condiciones de una convocatoria.","Distinguir hecho y opinión en una noticia.","Valorar la coherencia entre propósito y contenido."]}
            ]
          },
          {
            title: "Habilidades evaluadas",
            topics: [
              {n:"H1",title:"Idea central e ideas secundarias",def:"La idea central es el núcleo conceptual o argumento principal del texto.",concepts:["Suele aparecer en el primer párrafo o en el título.","Las ideas secundarias la amplían, ejemplifican o sustentan.","Cuidado con confundir el tema (sobre qué) con la idea central (qué se afirma sobre el tema)."]},
              {n:"H2",title:"Inferencia",def:"Capacidad de deducir conclusiones o significados implícitos que no están escritos explícitamente.",concepts:["Se basa en pistas del texto + conocimientos previos.","Tipos: inferencia local (entre dos oraciones) e inferencia global (de todo el texto).","Útil para identificar tono, intención del autor y consecuencias lógicas."]},
              {n:"H3",title:"Evaluación crítica",def:"Emitir un juicio sustentado sobre la coherencia y relevancia del contenido frente a su propósito.",concepts:["Valorar argumentos y contraargumentos.","Detectar falacias, sesgos o información insuficiente.","Distinguir hechos verificables de opiniones del autor."]}
            ]
          }
        ],
        quiz: [
          {q:"Al leer una convocatoria oficial, ¿qué acción corresponde a la evaluación crítica?",options:[["A","Memorizar la fecha de publicación"],["B","Valorar si los requisitos guardan correspondencia lógica con el objetivo"],["C","Contar el número de párrafos"]],correct:"B",just:"Evaluar implica emitir un juicio sustentado sobre la coherencia y relevancia del contenido frente a su propósito."},
          {q:"La idea central de un texto se identifica principalmente:",options:[["A","Contando las palabras repetidas"],["B","En el primer párrafo o título, como el núcleo argumental"],["C","En la última palabra del texto"]],correct:"B",just:"La idea central suele anunciarse en el primer párrafo (oración tópica) o en el título."}
        ]
      }
    };
