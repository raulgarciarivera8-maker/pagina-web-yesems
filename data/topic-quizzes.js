// ============ QUIZZES POR TEMA (Pensamiento Científico) ============
// Cada tema: 5 preguntas de opción múltiple con justificación.
// Formato: { q: pregunta, options: [["A","texto"],...], correct: "A", just: "explicación" }

window.topicQuizzes = {
  1: [
    { q: "¿Cuál es la unidad básica estructural y funcional de los seres vivos?", options: [["A","Tejido"],["B","Célula"],["C","Órgano"],["D","Molécula"]], correct: "B", just: "La célula es la unidad mínima que cumple funciones vitales (nutrición, relación, reproducción)." },
    { q: "Organelo encargado de producir ATP mediante respiración celular:", options: [["A","Ribosoma"],["B","Lisosoma"],["C","Mitocondria"],["D","Cloroplasto"]], correct: "C", just: "La mitocondria realiza la fosforilación oxidativa que genera ATP." },
    { q: "Diferencia clave entre célula procariota y eucariota:", options: [["A","Tamaño únicamente"],["B","Presencia de núcleo definido"],["C","Tener ADN"],["D","Tener membrana"]], correct: "B", just: "Las eucariotas poseen núcleo verdadero rodeado de membrana; las procariotas no." },
    { q: "Estructura exclusiva de células vegetales:", options: [["A","Mitocondria"],["B","Membrana plasmática"],["C","Pared celular de celulosa"],["D","Ribosomas"]], correct: "C", just: "La pared celular de celulosa es característica vegetal; los animales no la presentan." },
    { q: "Función principal del retículo endoplasmático rugoso:", options: [["A","Síntesis de lípidos"],["B","Síntesis de proteínas"],["C","Digestión celular"],["D","Almacén de agua"]], correct: "B", just: "Tiene ribosomas adheridos que sintetizan proteínas para exportación." }
  ],
  2: [
    { q: "El mecanismo central de la teoría evolutiva de Darwin es:", options: [["A","Uso y desuso"],["B","Selección natural"],["C","Mutación dirigida"],["D","Herencia de caracteres adquiridos"]], correct: "B", just: "Darwin propuso la selección natural: los individuos mejor adaptados sobreviven y se reproducen más." },
    { q: "Las islas Galápagos fueron clave porque Darwin observó:", options: [["A","Animales idénticos a los del continente"],["B","Pinzones con picos adaptados a distintas dietas"],["C","Ausencia de vida"],["D","Solo plantas"]], correct: "B", just: "Las variaciones en los picos de los pinzones evidenciaron adaptación a distintos alimentos." },
    { q: "Lamarck difería de Darwin porque proponía:", options: [["A","Selección natural"],["B","Herencia de caracteres adquiridos por uso"],["C","Que las especies son inmutables"],["D","Origen divino"]], correct: "B", just: "Lamarck pensaba que los rasgos desarrollados en vida se heredaban; Darwin lo refutó." },
    { q: "Una evidencia fósil que respalda la evolución es:", options: [["A","Las pirámides"],["B","Formas transicionales como Archaeopteryx"],["C","Los meteoritos"],["D","La fotosíntesis"]], correct: "B", just: "Archaeopteryx muestra rasgos intermedios entre reptiles y aves." },
    { q: "La obra clave de Darwin (1859) es:", options: [["A","Principia"],["B","El origen de las especies"],["C","La doble hélice"],["D","Sistema natural"]], correct: "B", just: "\"El origen de las especies\" expone la teoría de evolución por selección natural." }
  ],
  3: [
    { q: "Padre de la genética por sus experimentos con chícharos:", options: [["A","Darwin"],["B","Mendel"],["C","Watson"],["D","Pasteur"]], correct: "B", just: "Gregor Mendel descubrió las leyes de la herencia con Pisum sativum." },
    { q: "Un alelo dominante se expresa cuando:", options: [["A","Solo está en homocigosis"],["B","Está presente al menos una vez"],["C","Nunca se expresa"],["D","Solo en mitocondrias"]], correct: "B", just: "Con una sola copia (heterocigoto) ya enmascara al recesivo." },
    { q: "Genotipo significa:", options: [["A","Aspecto físico"],["B","Conjunto de alelos"],["C","Tipo de célula"],["D","Sexo del individuo"]], correct: "B", just: "El genotipo es la combinación de alelos; el fenotipo es la manifestación visible." },
    { q: "Cruza Aa × Aa produce proporción fenotípica:", options: [["A","1:1"],["B","3:1"],["C","9:3:3:1"],["D","2:1"]], correct: "B", just: "3 dominantes (AA, Aa, Aa) : 1 recesivo (aa)." },
    { q: "El ADN se encuentra principalmente en:", options: [["A","Citoplasma"],["B","Núcleo"],["C","Membrana"],["D","Ribosomas"]], correct: "B", just: "El ADN nuclear contiene la mayor parte de la información hereditaria." }
  ],
  4: [
    { q: "Biomolécula que constituye la principal reserva energética rápida:", options: [["A","Lípidos"],["B","Carbohidratos"],["C","Proteínas"],["D","Ácidos nucleicos"]], correct: "B", just: "La glucosa y el glucógeno son fuentes energéticas de uso inmediato." },
    { q: "La unidad básica de las proteínas es:", options: [["A","Glucosa"],["B","Nucleótido"],["C","Aminoácido"],["D","Ácido graso"]], correct: "C", just: "Las proteínas son polímeros de aminoácidos unidos por enlaces peptídicos." },
    { q: "Los lípidos se caracterizan por ser:", options: [["A","Solubles en agua"],["B","Insolubles en agua"],["C","Iónicos"],["D","Polares fuertes"]], correct: "B", just: "Son hidrofóbicos; solubles en solventes apolares." },
    { q: "El ADN está formado por:", options: [["A","Aminoácidos"],["B","Nucleótidos"],["C","Monosacáridos"],["D","Ácidos grasos"]], correct: "B", just: "Cada nucleótido = azúcar (desoxirribosa) + fosfato + base nitrogenada." },
    { q: "Las bases nitrogenadas del ADN son:", options: [["A","A, U, G, C"],["B","A, T, G, C"],["C","A, T, U, C"],["D","T, U, G, C"]], correct: "B", just: "El ADN usa Timina; el ARN usa Uracilo en su lugar." }
  ],
  5: [
    { q: "Modelo atómico que propuso electrones en órbitas fijas:", options: [["A","Dalton"],["B","Thomson"],["C","Bohr"],["D","Rutherford"]], correct: "C", just: "Bohr (1913) propuso niveles de energía cuantizados para los electrones." },
    { q: "El modelo del 'pudín con pasas' fue propuesto por:", options: [["A","Dalton"],["B","Thomson"],["C","Rutherford"],["D","Schrödinger"]], correct: "B", just: "Thomson imaginó electrones incrustados en una masa positiva." },
    { q: "Rutherford descubrió, con su experimento de la lámina de oro:", options: [["A","El neutrón"],["B","Que el átomo es mayormente vacío con núcleo denso"],["C","La fisión nuclear"],["D","El electrón"]], correct: "B", just: "La dispersión de partículas alfa reveló un núcleo pequeño y muy denso." },
    { q: "El modelo cuántico actual describe al electrón como:", options: [["A","Una partícula en órbita fija"],["B","Una onda en orbital probabilístico"],["C","Un punto inmóvil"],["D","Una pasa dentro de un pudín"]], correct: "B", just: "Schrödinger y Heisenberg describieron orbitales (zonas de probabilidad)." },
    { q: "Número atómico (Z) corresponde a:", options: [["A","Número de protones"],["B","Número de neutrones"],["C","Suma de protones y neutrones"],["D","Número de electrones de valencia"]], correct: "A", just: "Z identifica al elemento y es el número de protones del núcleo." }
  ],
  6: [
    { q: "Enlace formado por transferencia de electrones entre metal y no metal:", options: [["A","Covalente"],["B","Iónico"],["C","Metálico"],["D","De hidrógeno"]], correct: "B", just: "El metal cede electrones y el no metal los acepta formando iones." },
    { q: "El enlace covalente se forma cuando:", options: [["A","Se transfieren electrones"],["B","Se comparten electrones"],["C","Hay metales únicamente"],["D","Hay solo iones"]], correct: "B", just: "Dos no metales comparten pares de electrones para alcanzar el octeto." },
    { q: "El NaCl es un compuesto:", options: [["A","Covalente"],["B","Iónico"],["C","Metálico"],["D","Puro elemento"]], correct: "B", just: "Na cede 1 electrón al Cl: forma Na⁺ y Cl⁻ unidos por atracción electrostática." },
    { q: "La 'mar de electrones' caracteriza al enlace:", options: [["A","Iónico"],["B","Covalente polar"],["C","Metálico"],["D","Puente de hidrógeno"]], correct: "C", just: "Los electrones de valencia están deslocalizados entre cationes metálicos." },
    { q: "El agua (H₂O) tiene enlaces:", options: [["A","Iónicos"],["B","Covalentes polares"],["C","Metálicos"],["D","Apolares"]], correct: "B", just: "El oxígeno es más electronegativo que el H y atrae más los electrones compartidos." }
  ],
  7: [
    { q: "El estado en que las partículas tienen forma y volumen definidos es:", options: [["A","Sólido"],["B","Líquido"],["C","Gas"],["D","Plasma"]], correct: "A", just: "En el sólido las partículas vibran sin desplazarse: hay orden y rigidez." },
    { q: "Cambio de líquido a gas se llama:", options: [["A","Fusión"],["B","Condensación"],["C","Evaporación"],["D","Sublimación"]], correct: "C", just: "La evaporación (o vaporización) ocurre al absorber energía." },
    { q: "Pasar directamente de sólido a gas es:", options: [["A","Fusión"],["B","Sublimación"],["C","Solidificación"],["D","Condensación"]], correct: "B", just: "Sublimación: ejemplo, el hielo seco (CO₂ sólido)." },
    { q: "En un gas, las partículas:", options: [["A","Están muy ordenadas"],["B","Se mueven libremente y ocupan todo el volumen"],["C","No tienen energía"],["D","Vibran sin moverse"]], correct: "B", just: "Los gases no tienen forma ni volumen propios; las partículas se mueven al azar." },
    { q: "El cuarto estado de la materia es:", options: [["A","Sólido amorfo"],["B","Plasma"],["C","Líquido viscoso"],["D","Gel"]], correct: "B", just: "El plasma es un gas ionizado, presente en estrellas y rayos." }
  ],
  8: [
    { q: "Un cuerpo flota cuando:", options: [["A","Su densidad > a la del fluido"],["B","Su densidad < a la del fluido"],["C","Pesa mucho"],["D","Es grande"]], correct: "B", just: "Principio de Arquímedes: flota si su densidad es menor que la del fluido." },
    { q: "La fuerza que se opone al movimiento entre superficies en contacto es:", options: [["A","Gravedad"],["B","Fricción"],["C","Empuje"],["D","Tensión"]], correct: "B", just: "La fricción actúa paralela a las superficies, oponiéndose al movimiento." },
    { q: "Un cuerpo está en equilibrio cuando la suma de fuerzas es:", options: [["A","Positiva"],["B","Cero"],["C","Negativa"],["D","Variable"]], correct: "B", just: "Primera ley de Newton: ΣF = 0 implica reposo o velocidad constante." },
    { q: "La fricción cinética es:", options: [["A","Mayor que la estática"],["B","Menor que la estática"],["C","Igual a la gravedad"],["D","Inexistente"]], correct: "B", just: "Cuesta más iniciar el movimiento que mantenerlo: μₑ > μc." },
    { q: "Principio de Arquímedes: el empuje es igual a:", options: [["A","El peso del cuerpo"],["B","El peso del fluido desalojado"],["C","La densidad del cuerpo"],["D","El volumen total"]], correct: "B", just: "E = ρ_fluido × V_desalojado × g." }
  ],
  9: [
    { q: "El impulso nervioso es de naturaleza:", options: [["A","Química únicamente"],["B","Electroquímica"],["C","Mecánica"],["D","Térmica"]], correct: "B", just: "Las neuronas transmiten señales por cambios de potencial y neurotransmisores." },
    { q: "La temperatura corporal humana se regula por:", options: [["A","Riñones"],["B","Hipotálamo"],["C","Hígado"],["D","Estómago"]], correct: "B", just: "El hipotálamo actúa como termostato corporal." },
    { q: "El sudor enfría al cuerpo porque:", options: [["A","Es frío al salir"],["B","Su evaporación absorbe calor"],["C","Aumenta la masa"],["D","Crea fricción"]], correct: "B", just: "El cambio de fase líquido→gas requiere energía que toma de la piel." },
    { q: "Los animales homeotermos:", options: [["A","Cambian su temperatura con el ambiente"],["B","Mantienen temperatura constante"],["C","No regulan temperatura"],["D","Solo viven en frío"]], correct: "B", just: "Mamíferos y aves regulan su temperatura interna independientemente del ambiente." },
    { q: "La sinapsis es:", options: [["A","Una célula muscular"],["B","La unión funcional entre dos neuronas"],["C","Un órgano"],["D","Un hueso"]], correct: "B", just: "Punto de comunicación donde se libera el neurotransmisor." }
  ],
  10: [
    { q: "Tecnología médica usada para visualizar tejidos internos sin cirugía:", options: [["A","Termómetro"],["B","Resonancia magnética"],["C","Estetoscopio"],["D","Báscula"]], correct: "B", just: "La RM usa campos magnéticos para imágenes detalladas de tejidos blandos." },
    { q: "Las vacunas funcionan al:", options: [["A","Matar virus en sangre"],["B","Entrenar al sistema inmune con antígenos debilitados"],["C","Aumentar temperatura"],["D","Inhibir neuronas"]], correct: "B", just: "Generan memoria inmunológica sin causar enfermedad grave." },
    { q: "Avance biotecnológico que permite editar genes con precisión:", options: [["A","PCR"],["B","CRISPR"],["C","Microscopio óptico"],["D","Anestesia"]], correct: "B", just: "CRISPR/Cas9 corta el ADN en sitios específicos para editar genomas." },
    { q: "Antibiótico descubierto por Fleming (1928):", options: [["A","Aspirina"],["B","Penicilina"],["C","Insulina"],["D","Morfina"]], correct: "B", just: "La penicilina, del hongo Penicillium, revolucionó la medicina." },
    { q: "Una aplicación de los rayos X es:", options: [["A","Cocinar alimentos"],["B","Diagnóstico médico"],["C","Producir oxígeno"],["D","Detectar olores"]], correct: "B", just: "Los rayos X atraviesan tejidos blandos pero no los huesos: revelan fracturas." }
  ],
  11: [
    { q: "Un cambio químico se reconoce por:", options: [["A","Cambio de forma"],["B","Aparición de nuevas sustancias"],["C","Cambio de estado"],["D","Cambio de tamaño"]], correct: "B", just: "Hay reacción cuando se forman compuestos con propiedades diferentes." },
    { q: "La oxidación del hierro produce:", options: [["A","Plomo"],["B","Óxido de hierro"],["C","Vapor de agua"],["D","Aluminio"]], correct: "B", just: "Fe + O₂ → Fe₂O₃ (herrumbre rojiza)." },
    { q: "Ley de conservación de la masa fue establecida por:", options: [["A","Newton"],["B","Lavoisier"],["C","Mendeléyev"],["D","Bohr"]], correct: "B", just: "Lavoisier: \"la materia no se crea ni se destruye, solo se transforma\"." },
    { q: "Una reacción de combustión requiere:", options: [["A","Solo combustible"],["B","Combustible + oxígeno + calor"],["C","Solo oxígeno"],["D","Agua"]], correct: "B", just: "El triángulo del fuego: comburente, combustible y energía de activación." },
    { q: "Un indicador de cambio físico (no químico) es:", options: [["A","Romper papel"],["B","Quemar papel"],["C","Oxidar hierro"],["D","Cocer un huevo"]], correct: "A", just: "Romper papel no altera su composición química, solo su forma." }
  ],
  12: [
    { q: "Para separar arena de agua se usa:", options: [["A","Destilación"],["B","Filtración"],["C","Imán"],["D","Cromatografía"]], correct: "B", just: "La filtración separa sólidos insolubles de un líquido mediante un medio poroso." },
    { q: "Para separar sal disuelta en agua se usa:", options: [["A","Filtración"],["B","Evaporación o destilación"],["C","Imantación"],["D","Decantación"]], correct: "B", just: "Al evaporar el agua queda la sal como residuo sólido." },
    { q: "La decantación se usa para:", options: [["A","Líquidos miscibles"],["B","Líquidos inmiscibles o sólido y líquido"],["C","Gases"],["D","Imanes"]], correct: "B", just: "Aprovecha la diferencia de densidad: agua-aceite, por ejemplo." },
    { q: "Para separar limaduras de hierro de arena se utiliza:", options: [["A","Filtración"],["B","Imantación"],["C","Destilación"],["D","Cromatografía"]], correct: "B", just: "Solo el hierro es ferromagnético; el imán lo atrae y separa." },
    { q: "Cromatografía permite separar:", options: [["A","Sólidos grandes"],["B","Pigmentos o componentes por afinidad"],["C","Gases nobles"],["D","Solo agua"]], correct: "B", just: "Usa fase móvil + fase estacionaria; aplicada en tinta, sangre, drogas." }
  ],
  13: [
    { q: "Principal causa del calentamiento global:", options: [["A","Aumento de gases de efecto invernadero"],["B","Erupciones solares"],["C","Más nubes"],["D","Menos plantas marinas"]], correct: "A", just: "CO₂ y metano por combustibles fósiles atrapan más radiación infrarroja." },
    { q: "El smog en ciudades afecta principalmente al sistema:", options: [["A","Óseo"],["B","Respiratorio"],["C","Endócrino"],["D","Reproductor"]], correct: "B", just: "Partículas y ozono troposférico irritan vías y pulmones." },
    { q: "La capa de ozono protege la vida porque:", options: [["A","Genera oxígeno"],["B","Filtra rayos UV"],["C","Calienta la Tierra"],["D","Refleja la luna"]], correct: "B", just: "El O₃ estratosférico absorbe la radiación ultravioleta dañina." },
    { q: "El reciclaje busca:", options: [["A","Quemar más residuos"],["B","Reincorporar materiales y reducir residuos"],["C","Acumular basura"],["D","Aumentar minería"]], correct: "B", just: "Disminuye extracción de recursos y residuos en vertederos." },
    { q: "Bioacumulación se refiere a:", options: [["A","Crecer rápido"],["B","Concentración creciente de contaminantes en la cadena alimentaria"],["C","Acumular plantas"],["D","Multiplicación de células"]], correct: "B", just: "Mercurio o DDT se concentran al subir niveles tróficos." }
  ],
  14: [
    { q: "Un organismo transgénico es aquel que:", options: [["A","Vive mucho tiempo"],["B","Tiene un gen de otra especie"],["C","Solo se reproduce sexualmente"],["D","Es estéril"]], correct: "B", just: "Se le ha incorporado ADN externo (ej. maíz Bt con gen bacteriano)." },
    { q: "Dolly (1996) fue famosa por ser:", options: [["A","Una vaca transgénica"],["B","El primer mamífero clonado"],["C","Una planta híbrida"],["D","Un perro modificado"]], correct: "B", just: "Oveja clonada por transferencia nuclear en el Roslin Institute." },
    { q: "CRISPR/Cas9 es una herramienta para:", options: [["A","Detectar virus"],["B","Editar genes con precisión"],["C","Clonar células"],["D","Medir temperatura"]], correct: "B", just: "Cas9 corta el ADN en una secuencia guiada por ARN; permite editar." },
    { q: "Un riesgo ético de la manipulación genética es:", options: [["A","Resistencia a enfermedades"],["B","Bebés a la carta o desigualdad"],["C","Mejor cosecha"],["D","Menor costo"]], correct: "B", just: "Modificar embriones humanos plantea dilemas de eugenesia y equidad." },
    { q: "Un beneficio agrícola del cultivo transgénico es:", options: [["A","Más plagas"],["B","Resistencia a plagas o sequía"],["C","Sabor más amargo"],["D","Menor productividad"]], correct: "B", just: "Por ejemplo, maíz Bt resiste el gusano cogollero sin pesticidas." }
  ],
  15: [
    { q: "La fuerza que mantiene a los planetas orbitando al Sol es:", options: [["A","Magnetismo"],["B","Gravedad"],["C","Tensión"],["D","Fricción"]], correct: "B", just: "Ley de gravitación universal de Newton: F = G·m₁·m₂ / r²." },
    { q: "El planeta más cercano al Sol es:", options: [["A","Venus"],["B","Mercurio"],["C","Marte"],["D","Tierra"]], correct: "B", just: "Mercurio orbita a ~58 millones de km del Sol." },
    { q: "Las estaciones del año se deben a:", options: [["A","Distancia al Sol"],["B","Inclinación del eje terrestre"],["C","La Luna"],["D","Velocidad de la Tierra"]], correct: "B", just: "La inclinación de 23.5° hace que los rayos lleguen más directos o inclinados según la época." },
    { q: "Kepler descubrió que las órbitas planetarias son:", options: [["A","Circulares"],["B","Elípticas"],["C","Cuadradas"],["D","Espirales"]], correct: "B", just: "Primera ley de Kepler: órbitas elípticas con el Sol en un foco." },
    { q: "La Vía Láctea es:", options: [["A","Un sistema solar"],["B","Una galaxia"],["C","Una nebulosa"],["D","Un asteroide"]], correct: "B", just: "Galaxia espiral que contiene al Sistema Solar y ~200 mil millones de estrellas." }
  ],
  16: [
    { q: "Velocidad se define como:", options: [["A","Distancia × tiempo"],["B","Desplazamiento / tiempo"],["C","Tiempo / distancia"],["D","Masa × aceleración"]], correct: "B", just: "v = Δx/Δt; incluye dirección (es vector)." },
    { q: "Aceleración es:", options: [["A","Cambio de masa"],["B","Cambio de velocidad por unidad de tiempo"],["C","Distancia recorrida"],["D","Inversa de velocidad"]], correct: "B", just: "a = Δv/Δt; medida en m/s²." },
    { q: "Si un auto va a velocidad constante, su aceleración es:", options: [["A","Máxima"],["B","Cero"],["C","Negativa"],["D","Infinita"]], correct: "B", just: "Sin cambio de velocidad ⇒ a = 0." },
    { q: "Un objeto en caída libre acelera a aproximadamente:", options: [["A","1 m/s²"],["B","9.8 m/s²"],["C","100 m/s²"],["D","0 m/s²"]], correct: "B", just: "Gravedad terrestre g ≈ 9.8 m/s² (ignorando aire)." },
    { q: "Si recorres 100 m en 20 s, tu rapidez promedio es:", options: [["A","2 m/s"],["B","5 m/s"],["C","20 m/s"],["D","200 m/s"]], correct: "B", just: "v = 100/20 = 5 m/s." }
  ],
  17: [
    { q: "La nanotecnología trabaja a escala:", options: [["A","Milímetro"],["B","Nanómetro (10⁻⁹ m)"],["C","Kilómetro"],["D","Micrómetro"]], correct: "B", just: "1 nm = 1 mil millonésima de metro; permite manipular átomos y moléculas." },
    { q: "Inteligencia artificial se refiere a:", options: [["A","Robots humanoides solamente"],["B","Sistemas que simulan aprendizaje y razonamiento"],["C","Computadoras antiguas"],["D","Internet"]], correct: "B", just: "Algoritmos que reconocen patrones, aprenden y toman decisiones." },
    { q: "La energía solar fotovoltaica:", options: [["A","Quema carbón"],["B","Convierte luz en electricidad"],["C","Genera petróleo"],["D","Produce CO₂"]], correct: "B", just: "Los paneles usan el efecto fotoeléctrico en silicio." },
    { q: "Un avance reciente en exploración espacial es:", options: [["A","El telégrafo"],["B","Cohetes reutilizables"],["C","La pólvora"],["D","El globo aerostático"]], correct: "B", just: "SpaceX y otras han desarrollado cohetes que aterrizan y se reutilizan." },
    { q: "La impresión 3D permite:", options: [["A","Solo imprimir papel"],["B","Crear objetos físicos por capas a partir de un diseño digital"],["C","Generar electricidad"],["D","Cocinar"]], correct: "B", just: "Fabricación aditiva: deposita material capa por capa siguiendo un modelo 3D." }
  ],
  18: [
    { q: "1 gramo de carbohidratos aporta:", options: [["A","4 kcal"],["B","9 kcal"],["C","7 kcal"],["D","2 kcal"]], correct: "A", just: "Carbohidratos y proteínas: 4 kcal/g; lípidos: 9 kcal/g." },
    { q: "El nutriente con MAYOR aporte calórico por gramo es:", options: [["A","Proteína"],["B","Carbohidrato"],["C","Lípido"],["D","Agua"]], correct: "C", just: "Los lípidos aportan 9 kcal/g — más del doble que los otros." },
    { q: "Una caloría es:", options: [["A","Una unidad de masa"],["B","Energía para elevar 1 g de agua 1 °C"],["C","Unidad de presión"],["D","Una vitamina"]], correct: "B", just: "1 cal eleva 1 g de agua de 14.5 a 15.5 °C; 1 kcal = 1000 cal." },
    { q: "El alcohol etílico aporta aproximadamente:", options: [["A","1 kcal/g"],["B","7 kcal/g"],["C","4 kcal/g"],["D","0 kcal/g"]], correct: "B", just: "El etanol aporta 7 kcal/g (energía vacía, sin nutrientes esenciales)." },
    { q: "100 g de un alimento con 20 g de carbohidratos, 10 g de proteína y 5 g de grasa aportan:", options: [["A","165 kcal"],["B","100 kcal"],["C","200 kcal"],["D","250 kcal"]], correct: "A", just: "(20×4) + (10×4) + (5×9) = 80 + 40 + 45 = 165 kcal." }
  ],
  19: [
    { q: "Una sustancia pura es aquella que:", options: [["A","Es muy cara"],["B","Tiene composición química definida y constante"],["C","Está mezclada"],["D","Es siempre líquida"]], correct: "B", just: "Puede ser elemento (Fe, O₂) o compuesto (H₂O, NaCl); composición fija." },
    { q: "Una mezcla heterogénea es:", options: [["A","Agua con sal"],["B","Ensalada o agua con aceite"],["C","Aire limpio"],["D","Acero"]], correct: "B", just: "Se distinguen sus componentes a simple vista o microscopio." },
    { q: "El aire es un ejemplo de:", options: [["A","Elemento puro"],["B","Mezcla homogénea (gases)"],["C","Compuesto"],["D","Mezcla heterogénea"]], correct: "B", just: "N₂, O₂, CO₂... mezclados uniformemente: solución gaseosa." },
    { q: "El agua (H₂O) es:", options: [["A","Un elemento"],["B","Un compuesto"],["C","Una mezcla"],["D","Una aleación"]], correct: "B", just: "Compuesto: H y O unidos químicamente en proporción fija 2:1." },
    { q: "Una aleación como el bronce es:", options: [["A","Mezcla homogénea de metales"],["B","Un elemento"],["C","Un compuesto"],["D","Una emulsión"]], correct: "A", just: "Bronce = Cu + Sn; mezcla sólida con composición variable." }
  ],
  20: [
    { q: "Energía cinética es la asociada a:", options: [["A","La posición"],["B","El movimiento"],["C","La temperatura solamente"],["D","La carga"]], correct: "B", just: "Ec = ½·m·v²; depende de la masa y la velocidad." },
    { q: "Energía potencial gravitatoria se calcula como:", options: [["A","m·v"],["B","m·g·h"],["C","½·m·v²"],["D","F·d"]], correct: "B", just: "Ep = m·g·h: depende de la altura sobre un nivel de referencia." },
    { q: "Una pelota en lo alto de una colina tiene principalmente:", options: [["A","Energía cinética"],["B","Energía potencial"],["C","Sin energía"],["D","Energía química"]], correct: "B", just: "Está en reposo a cierta altura: la energía está almacenada." },
    { q: "Cuando la pelota cae, su energía potencial se convierte en:", options: [["A","Eléctrica"],["B","Cinética"],["C","Sonora"],["D","Magnética"]], correct: "B", just: "Conservación de la energía mecánica: Ep ↓ ⇔ Ec ↑." },
    { q: "La energía cinética de un objeto se duplica si:", options: [["A","Se duplica la masa"],["B","La velocidad se multiplica por √2"],["C","Se reduce la masa a la mitad"],["D","Se duplica la velocidad"]], correct: "B", just: "Ec ∝ v²; v×√2 ⇒ Ec×2. Duplicar v cuadruplica la energía." }
  ],
  21: [
    { q: "Reacción exotérmica es aquella que:", options: [["A","Absorbe energía"],["B","Libera energía"],["C","No produce cambio"],["D","Detiene el tiempo"]], correct: "B", just: "Libera calor o luz; ΔH < 0. Ejemplo: combustión." },
    { q: "Reacción endotérmica significa:", options: [["A","Libera calor"],["B","Absorbe calor del entorno"],["C","No requiere energía"],["D","Es siempre rápida"]], correct: "B", just: "Toma energía: ΔH > 0. Ejemplo: fotosíntesis." },
    { q: "La fotosíntesis es una reacción:", options: [["A","Exotérmica"],["B","Endotérmica (absorbe luz solar)"],["C","Sin energía"],["D","De combustión"]], correct: "B", just: "Las plantas usan energía solar para sintetizar glucosa." },
    { q: "La combustión de gasolina es:", options: [["A","Endotérmica"],["B","Exotérmica"],["C","Neutra"],["D","Frío"]], correct: "B", just: "Libera mucha energía como calor y luz." },
    { q: "Ley de conservación de la energía dice que la energía:", options: [["A","Desaparece"],["B","Se transforma pero no se crea ni destruye"],["C","Aumenta sola"],["D","Solo existe en sólidos"]], correct: "B", just: "Primer principio de la termodinámica." }
  ],
  22: [
    { q: "Material que conduce bien la electricidad:", options: [["A","Madera"],["B","Cobre"],["C","Plástico"],["D","Vidrio"]], correct: "B", just: "El cobre tiene electrones libres que permiten el flujo de corriente." },
    { q: "Un material aislante es:", options: [["A","Hierro"],["B","Caucho o plástico"],["C","Aluminio"],["D","Plata"]], correct: "B", just: "Los aislantes no permiten el paso de corriente (alta resistencia)." },
    { q: "Los metales conducen porque tienen:", options: [["A","Muchos protones"],["B","Electrones libres deslocalizados"],["C","Iones positivos fijos"],["D","Solo neutrones"]], correct: "B", just: "El enlace metálico crea un \"mar de electrones\" móviles." },
    { q: "El mejor conductor eléctrico es:", options: [["A","Oro"],["B","Plata"],["C","Cobre"],["D","Aluminio"]], correct: "B", just: "La plata tiene la mayor conductividad, pero se usa cobre por costo." },
    { q: "Un semiconductor (como el silicio) se caracteriza por:", options: [["A","Conducir siempre igual"],["B","Conducir según condiciones (temperatura, dopaje)"],["C","No conducir nunca"],["D","Ser líquido"]], correct: "B", just: "Base de la electrónica moderna; chips, diodos, transistores." }
  ],
  23: [
    { q: "Un fenómeno natural eléctrico es:", options: [["A","Lluvia"],["B","Rayo"],["C","Marea"],["D","Sismo"]], correct: "B", just: "El rayo es una descarga eléctrica entre nube y tierra." },
    { q: "Voltaje se mide en:", options: [["A","Amperios"],["B","Voltios"],["C","Watts"],["D","Ohms"]], correct: "B", just: "V es la unidad de diferencia de potencial eléctrico." },
    { q: "Ley de Ohm establece que:", options: [["A","V = I·R"],["B","V = m·a"],["C","E = m·c²"],["D","F = G·m₁·m₂"]], correct: "A", just: "Voltaje = Intensidad × Resistencia." },
    { q: "Una pila o batería proporciona:", options: [["A","Corriente alterna"],["B","Corriente continua"],["C","Sonido"],["D","Calor solamente"]], correct: "B", just: "DC: el flujo de electrones va en un solo sentido." },
    { q: "El pararrayos protege porque:", options: [["A","Repele rayos"],["B","Conduce la descarga a tierra"],["C","Genera viento"],["D","Refleja luz"]], correct: "B", just: "Dirige la corriente del rayo a tierra evitando que dañe la estructura." }
  ],
  24: [
    { q: "México es considerado país megadiverso porque:", options: [["A","Es muy grande"],["B","Concentra gran número de especies y ecosistemas"],["C","Tiene mucho desierto"],["D","Pocas montañas"]], correct: "B", just: "Está entre los 17 países con mayor biodiversidad del planeta." },
    { q: "El organismo mexicano encargado de la biodiversidad es:", options: [["A","INEGI"],["B","CONABIO"],["C","SEP"],["D","CFE"]], correct: "B", just: "CONABIO = Comisión Nacional para el Conocimiento y Uso de la Biodiversidad." },
    { q: "Un endemismo es:", options: [["A","Una enfermedad"],["B","Especie que solo existe en una región"],["C","Migración"],["D","Especie invasora"]], correct: "B", just: "El ajolote y la vaquita marina son endémicos de México." },
    { q: "Una especie en peligro de extinción en México es:", options: [["A","Paloma común"],["B","Vaquita marina"],["C","Gato doméstico"],["D","Perro pastor"]], correct: "B", just: "Quedan menos de 20 vaquitas; cetáceo endémico del Alto Golfo." },
    { q: "El maíz es importante en México por ser:", options: [["A","Introducido recientemente"],["B","Cultivo originario y base cultural y alimentaria"],["C","Importado"],["D","Una especie animal"]], correct: "B", just: "Domesticado en Mesoamérica hace ~9000 años; centro de origen y diversidad." }
  ],
  25: [
    { q: "La tecnología es:", options: [["A","Solo computadoras"],["B","Aplicación práctica del conocimiento científico"],["C","Ciencia teórica"],["D","Magia"]], correct: "B", just: "Usa principios científicos para resolver problemas y crear herramientas." },
    { q: "Un ejemplo de tecnología derivada de la física es:", options: [["A","Los antibióticos"],["B","El láser"],["C","La selección natural"],["D","El método científico"]], correct: "B", just: "El láser nació de la teoría cuántica de la radiación (Einstein, Maiman)." },
    { q: "Internet surgió originalmente como:", options: [["A","Red comercial"],["B","Proyecto militar y académico (ARPANET)"],["C","Videojuego"],["D","Red bancaria"]], correct: "B", just: "ARPANET (1969) fue precursor del Internet moderno." },
    { q: "Telecomunicaciones permiten:", options: [["A","Mover materia"],["B","Transmitir información a distancia"],["C","Crear materia"],["D","Generar comida"]], correct: "B", just: "Telégrafo, radio, satélites: transmiten señales electromagnéticas." },
    { q: "La biotecnología combina biología con:", options: [["A","Magia"],["B","Ingeniería y tecnología"],["C","Solo química"],["D","Astrología"]], correct: "B", just: "Aplica organismos o sus componentes para producir bienes (insulina, vacunas)." }
  ],
  26: [
    { q: "Una adaptación es:", options: [["A","Un cambio rápido individual"],["B","Característica que mejora la supervivencia en un ambiente"],["C","Una enfermedad"],["D","Una mutación letal"]], correct: "B", just: "Surge por selección natural a lo largo de generaciones." },
    { q: "El camuflaje es una adaptación:", options: [["A","Reproductiva"],["B","Morfológica/comportamental para evitar depredadores"],["C","Digestiva"],["D","Auditiva"]], correct: "B", just: "Permite confundirse con el entorno (camaleón, mariposas)." },
    { q: "Migración estacional de aves es una adaptación:", options: [["A","Genética inmediata"],["B","Conductual para buscar mejores condiciones"],["C","Anatómica"],["D","Sin valor"]], correct: "B", just: "Las aves migran para encontrar alimento y clima favorable según la época." },
    { q: "La reproducción sexual aumenta la supervivencia porque:", options: [["A","Es más rápida"],["B","Genera variabilidad genética"],["C","Requiere menos energía"],["D","Solo produce clones"]], correct: "B", just: "Recombina alelos: poblaciones más adaptables a cambios ambientales." },
    { q: "Una característica heredada favorable se transmite a la descendencia mediante:", options: [["A","Aprendizaje"],["B","Genes"],["C","Imitación"],["D","Magia"]], correct: "B", just: "La selección natural actúa sobre rasgos heredables codificados en el ADN." }
  ],
  27: [
    { q: "La fuente primaria de energía para los ecosistemas terrestres es:", options: [["A","El viento"],["B","El Sol"],["C","La Luna"],["D","El petróleo"]], correct: "B", just: "Las plantas captan energía solar y la convierten en química (fotosíntesis)." },
    { q: "Los productores son organismos que:", options: [["A","Comen otros animales"],["B","Sintetizan su alimento (fotosíntesis/quimiosíntesis)"],["C","Descomponen materia"],["D","Parasitan"]], correct: "B", just: "Plantas, algas y algunas bacterias forman la base de la cadena." },
    { q: "Un consumidor primario es:", options: [["A","León"],["B","Conejo (herbívoro)"],["C","Hongo"],["D","Planta"]], correct: "B", just: "Se alimenta directamente de productores." },
    { q: "Los descomponedores (hongos, bacterias) cumplen la función de:", options: [["A","Producir oxígeno"],["B","Reciclar materia orgánica devolviendo nutrientes al suelo"],["C","Cazar presas"],["D","Crear nuevos organismos"]], correct: "B", just: "Liberan minerales al sustrato para que productores los reutilicen." },
    { q: "En cada nivel trófico se transfiere aproximadamente:", options: [["A","100% de la energía"],["B","10% de la energía"],["C","50%"],["D","0%"]], correct: "B", just: "Regla del 10%: el resto se disipa como calor (segunda ley termodinámica)." }
  ]
};

// PDFs por número de tema
window.topicPDFs = {
  1: "assets/pdfs/01_estructura_funciones_celula.pdf",
  2: "assets/pdfs/02_evolucion_darwin.pdf",
  3: "assets/pdfs/03_herencia_seres_vivos.pdf",
  4: "assets/pdfs/04_biomoleculas.pdf",
  5: "assets/pdfs/05_modelos_atomicos.pdf",
  6: "assets/pdfs/06_enlaces_quimicos.pdf",
  7: "assets/pdfs/07_estados_agregacion_materia.pdf",
  8: "assets/pdfs/08_equilibrio_friccion_flotacion.pdf",
  9: "assets/pdfs/09_electricidad_temperatura_biologia.pdf",
  10: "assets/pdfs/10_ciencia_tecnologia_salud.pdf",
  11: "assets/pdfs/11_cambios_reacciones_quimicas.pdf",
  12: "assets/pdfs/12_separacion_mezclas.pdf",
  13: "assets/pdfs/13_impacto_salud_ambiente.pdf",
  14: "assets/pdfs/14_manipulacion_genetica.pdf",
  15: "assets/pdfs/15_sistema_solar_gravitacion.pdf",
  16: "assets/pdfs/16_velocidad_aceleracion.pdf",
  17: "assets/pdfs/17_avances_tecnologicos.pdf",
  18: "assets/pdfs/18_aporte_calorico_alimentos.pdf",
  19: "assets/pdfs/19_composicion_quimica_sustancias.pdf",
  20: "assets/pdfs/20_energia_potencial_cinetica.pdf",
  21: "assets/pdfs/21_intercambio_energia_reacciones.pdf",
  22: "assets/pdfs/22_sustancias_conductoras.pdf",
  23: "assets/pdfs/23_manifestaciones_electricidad.pdf",
  24: "assets/pdfs/24_biodiversidad_mexico.pdf",
  25: "assets/pdfs/25_tecnologia_conocimiento_cientifico.pdf",
  26: "assets/pdfs/26_adaptacion_evolucion.pdf",
  27: "assets/pdfs/27_transformacion_energia_cadena_alimentaria.pdf"
};
