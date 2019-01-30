/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * bridgeanization and style inspired by:
 * https://bost.ocks.bridge/mike/chart/
 *
 */

var floorFilter = 8;
var buttonId = 'all';
var rawData;
var rawDataVar;
var links = [];
var connections;
var joinedData;
var floorPlanImage;
var floorPlanShowing = false;
var floorSeatingMode = 1;


function bubbleChart() {
  // Constants for sizing
  var width = 1800;
  var height = 1000;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var positionCenters = {
    "Faculty": { x: (width / 8)+50, y: height / 2 },
    "Research Staff": { x: 3 * width / 8, y: height / 2 },
    "Post-doc": { x: 5 * width / 8, y: height / 2 },
    "Graduate Student": { x: (7 * width / 8)-50, y: height / 2 }

  };

  // X locations of the position titles.
  var positionsTitleX = {
    "Faculty": width / 8,
    "Research Staff": 3 * width / 8,
    "Post-doc": 5 * width / 8,
    "Graduate Student": 7 * width / 8,
  };

  var bridgeCoreCenters = {
    "Bridge": { x: (width / 3)-100, y: height / 2 },
    "Core": { x: 2 * (width / 3)+100, y: height / 2 },

  };

  // X locations of the position titles.
  var bridgeCoreTitleX = {
    "Bridge": (width / 3) - 50,
    "Core": 2 * (width / 3) - 50,
  };

  var disciplineCenters = {
    "Core": { x: 3*(width / 9)-40, y: height / 3 },
    "Architecture and Planning": { x: 5*(width / 9)-20, y: height / 3 },
    "Engineering": { x: 7*(width / 9)+40, y: height / 3 },
    "Humanities, Arts, and Social Sciences":  { x: 3*(width / 9)-40, y: 2*(height / 3) },
    "Management":  { x: 5*(width / 9)-20, y: 2*(height / 3) },
    "Science":  { x: 7*(width / 9)+40, y: 2*(height / 3) },
  };

  var rowDivider = 22;
  var rowAddition = 100;
  var columnDivider = 16;
  var columnAddition = 70;


  var researchGroupCenters = {
    1: { x: 1*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    2: { x: 3*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    3: { x: 5*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    4: { x: 7*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    5: { x: 9*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    6: { x: 11*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    7: { x: 13*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    8: { x: 15*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    9: { x: 17*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    10: { x: 19*(width / rowDivider)+rowAddition, y: 1*(height / columnDivider)+columnAddition},
    11: { x: 1*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    12: { x: 3*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    13: { x: 5*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    14: { x: 7*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    15: { x: 9*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    16: { x: 11*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    17: { x: 13*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    18: { x: 15*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    19: { x: 17*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    20: { x: 19*(width / rowDivider)+rowAddition, y: 3*(height / columnDivider)+columnAddition},
    21: { x: 1*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    22: { x: 3*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    23: { x: 5*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    24: { x: 7*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    25: { x: 9*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    26: { x: 11*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    27: { x: 13*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    28: { x: 15*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    29: { x: 17*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    30: { x: 19*(width / rowDivider)+rowAddition, y: 5*(height / columnDivider)+columnAddition},
    31: { x: 1*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    32: { x: 3*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    33: { x: 5*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    34: { x: 7*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    35: { x: 9*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    36: { x: 11*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    37: { x: 13*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    38: { x: 15*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    39: { x: 17*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    40: { x: 19*(width / rowDivider)+rowAddition, y: 7*(height / columnDivider)+columnAddition},
    41: { x: 1*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    42: { x: 3*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    43: { x: 5*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    44: { x: 7*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    45: { x: 9*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    46: { x: 11*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    47: { x: 13*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    48: { x: 15*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    49: { x: 17*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    50: { x: 19*(width / rowDivider)+rowAddition, y: 9*(height / columnDivider)+columnAddition},
    51: { x: 1*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    52: { x: 3*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    53: { x: 5*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    54: { x: 7*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    55: { x: 9*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    56: { x: 11*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    57: { x: 13*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    58: { x: 15*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    59: { x: 17*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    60: { x: 19*(width / rowDivider)+rowAddition, y: 11*(height / columnDivider)+columnAddition},
    61: { x: 1*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    62: { x: 3*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    63: { x: 5*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    64: { x: 7*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    65: { x: 9*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    66: { x: 11*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    67: { x: 13*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    68: { x: 15*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    69: { x: 17*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},
    70: { x: 19*(width / rowDivider)+rowAddition, y: 13*(height / columnDivider)+columnAddition},

  };

  var seatCenters = {
pt1: { x:581.705655, y:308.458106},
pt2: { x:561.417088, y:308.458106},
pt3: { x:523.425113, y:308.780098},
pt4: { x:503.136546, y:308.780098},
pt5: { x:415.23582, y:308.458106},
pt6: { x:394.947253, y:308.458106},
pt7: { x:439.452154, y:311.528956},
pt8: { x:439.452154, y:324.847375},
pt9: { x:467.647605, y:311.528956},
pt10: { x:467.647605, y:324.847375},
pt11: { x:791.058415, y:311.528956},
pt12: { x:791.058415, y:324.847375},
pt13: { x:819.253866, y:311.528956},
pt14: { x:819.253866, y:324.847375},
pt15: { x:966.861546, y:311.528956},
pt16: { x:966.861546, y:324.847375},
pt17: { x:995.056997, y:311.528956},
pt18: { x:995.056997, y:324.847375},
pt19: { x:1366.924281, y:681.633887},
pt20: { x:1353.605862, y:681.633887},
pt21: { x:394.298061, y:328.09748},
pt22: { x:414.586627, y:328.09748},
pt23: { x:603.07026, y:436.655687},
pt24: { x:603.07026, y:463.903464},
pt25: { x:603.331073, y:548.023041},
pt26: { x:603.331073, y:575.270817},
pt27: { x:1181.577246, y:466.860717},
pt28: { x:1181.577246, y:494.108494},
pt29: { x:1181.83806, y:578.228071},
pt30: { x:1181.83806, y:605.475848},
pt31: { x:934.608825, y:308.458106},
pt32: { x:914.320259, y:308.458106},
pt33: { x:1425.863806, y:394.676318},
pt34: { x:1405.575239, y:394.676318},
pt35: { x:1364.52258, y:319.660938},
pt36: { x:1379.791525, y:319.660938},
pt37: { x:1396.856815, y:319.660938},
pt38: { x:1412.911661, y:319.660938},
pt39: { x:1364.52258, y:361.271173},
pt40: { x:1379.791525, y:361.271173},
pt41: { x:1396.856815, y:361.271173},
pt42: { x:1412.911661, y:361.271173},
pt43: { x:1425.699797, y:332.395075},
pt44: { x:1425.699797, y:347.659776},
pt45: { x:1301.693925, y:320.675773},
pt46: { x:1286.424981, y:320.675773},
pt47: { x:1303.37216, y:362.286007},
pt48: { x:1288.103216, y:362.286007},
pt49: { x:1271.540781, y:333.409909},
pt50: { x:1271.540781, y:348.674611},
pt51: { x:437.351881, y:367.365957},
pt52: { x:1225.631705, y:349.79883},
pt53: { x:1225.631705, y:372.417567},
pt54: { x:1222.234456, y:329.845356},
pt55: { x:1228.606436, y:308.142704},
pt56: { x:1110.544881, y:315.216656},
pt57: { x:1091.844186, y:307.348368},
pt58: { x:1030.40946, y:310.977175},
pt59: { x:1050.262074, y:306.793917},
pt60: { x:858.696343, y:321.949059},
pt61: { x:876.815239, y:312.820448},
pt62: { x:565.650709, y:384.146878},
pt63: { x:585.748848, y:381.373662},
pt64: { x:383.216302, y:382.339624},
pt65: { x:538.862183, y:382.261618},
pt66: { x:754.771077, y:330.86697},
pt67: { x:735.114188, y:325.843761},
pt68: { x:740.605644, y:306.976584},
pt69: { x:760.262533, y:311.999792},
pt70: { x:699.117256, y:307.21907},
pt71: { x:679.374424, y:311.893099},
pt72: { x:1315.461987, y:680.773772},
pt73: { x:1293.136373, y:684.403401},
pt74: { x:1247.342568, y:682.417467},
pt75: { x:1269.961305, y:682.417467},
pt76: { x:1221.692284, y:684.034809},
pt77: { x:1199.261924, y:681.121706},
pt78: { x:362.553534, y:328.09748},
pt79: { x:342.264968, y:328.09748},
pt80: { x:343.236152, y:308.780098},
pt81: { x:363.524718, y:308.780098},
pt82: { x:592.564369, y:733.929364},
pt83: { x:601.768175, y:713.267874},
pt84: { x:595.568141, y:668.322728},
pt85: { x:601.85933, y:690.048938},
pt86: { x:904.515234, y:499.934472},
pt87: { x:991.428151, y:487.856527},
pt88: { x:971.139584, y:487.856527},
pt89: { x:1072.895401, y:574.722209},
pt90: { x:1052.606834, y:595.010775},
pt91: { x:1257.856256, y:568.55336},
pt92: { x:1069.894896, y:456.378402},
pt93: { x:1057.013724, y:469.259573},
pt94: { x:845.930117, y:567.523757},
pt95: { x:845.930117, y:593.2861},
pt96: { x:904.515234, y:539.39704},
pt97: { x:941.723428, y:501.603668},
pt98: { x:941.723428, y:543.663363},
pt99: { x:846.874701, y:499.536951},
pt100: { x:846.874701, y:541.596646},
pt101: { x:884.082895, y:503.803274},
pt102: { x:884.082895, y:543.265842},
pt103: { x:1079.821959, y:499.13943},
pt104: { x:1079.821959, y:538.601998},
pt105: { x:1117.030153, y:500.808626},
pt106: { x:1117.030153, y:542.868321},
pt107: { x:1138.158305, y:503.47527},
pt108: { x:1138.158305, y:538.757025},
pt109: { x:676.748336, y:411.687814},
pt110: { x:705.80886, y:403.540144},
pt111: { x:705.80886, y:424.452998},
pt112: { x:668.600666, y:431.538753},
pt113: { x:668.600666, y:452.451607},
pt114: { x:758.081129, y:445.244244},
pt115: { x:736.650572, y:411.687814},
pt116: { x:765.711097, y:403.540144},
pt117: { x:765.711097, y:424.452998},
pt118: { x:728.502902, y:431.538753},
pt119: { x:876.725207, y:411.687814},
pt120: { x:847.664683, y:403.540144},
pt121: { x:847.664683, y:424.452998},
pt122: { x:884.872877, y:431.538753},
pt123: { x:884.872877, y:452.451607},
pt124: { x:906.614448, y:403.540144},
pt125: { x:906.614448, y:424.452998},
pt126: { x:914.244415, y:445.244244},
pt127: { x:943.822643, y:431.538753},
pt128: { x:935.674973, y:411.687814},
pt129: { x:718.56194, y:591.575409},
pt130: { x:698.273374, y:571.286843},
pt131: { x:833.843987, y:459.95609},
pt132: { x:846.725158, y:447.074919},
pt133: { x:708.7854, y:445.484835},
pt134: { x:721.666571, y:458.366006},
pt135: { x:708.7854, y:471.247178},
pt136: { x:1030.467437, y:411.687814},
pt137: { x:1059.527961, y:403.540144},
pt138: { x:1059.527961, y:424.452998},
pt139: { x:1022.319767, y:431.538753},
pt140: { x:1022.319767, y:452.451607},
pt141: { x:1111.80023, y:445.244244},
pt142: { x:1090.369673, y:411.687814},
pt143: { x:1119.430197, y:403.540144},
pt144: { x:1119.430197, y:424.452998},
pt145: { x:1082.222003, y:431.538753},
pt146: { x:794.947875, y:540.176828},
pt147: { x:815.236441, y:540.176828},
pt148: { x:1028.25081, y:536.774232},
pt149: { x:1049.681367, y:503.217802},
pt150: { x:1020.620843, y:495.070132},
pt151: { x:1020.620843, y:515.982987},
pt152: { x:1057.829037, y:523.068741},
pt153: { x:962.355174, y:589.7742},
pt154: { x:962.355174, y:629.236767},
pt155: { x:999.563369, y:591.443395},
pt156: { x:999.563369, y:633.50309},
pt157: { x:668.785329, y:500.331993},
pt158: { x:668.785329, y:542.391688},
pt159: { x:705.993524, y:504.598316},
pt160: { x:705.993524, y:544.060883},
pt161: { x:1030.467437, y:628.81218},
pt162: { x:1059.527961, y:636.95985},
pt163: { x:1059.527961, y:616.046996},
pt164: { x:1022.319767, y:608.961242},
pt165: { x:1022.319767, y:588.048387},
pt166: { x:1111.80023, y:595.25575},
pt167: { x:1090.369673, y:628.81218},
pt168: { x:1119.430197, y:636.95985},
pt169: { x:1119.430197, y:616.046996},
pt170: { x:1082.222003, y:608.961242},
pt171: { x:786.552044, y:590.569241},
pt172: { x:786.552044, y:632.628936},
pt173: { x:823.760238, y:594.835564},
pt174: { x:823.760238, y:634.298132},
pt175: { x:676.748336, y:626.97243},
pt176: { x:705.80886, y:635.120101},
pt177: { x:705.80886, y:614.207246},
pt178: { x:668.600666, y:607.121492},
pt179: { x:668.600666, y:586.208637},
pt180: { x:758.081129, y:593.416001},
pt181: { x:736.650572, y:626.97243},
pt182: { x:765.711097, y:635.120101},
pt183: { x:765.711097, y:614.207246},
pt184: { x:728.502902, y:607.121492},
pt185: { x:876.725207, y:626.922623},
pt186: { x:847.664683, y:635.070293},
pt187: { x:847.664683, y:614.157438},
pt188: { x:884.872877, y:607.071684},
pt189: { x:884.872877, y:586.15883},
pt190: { x:906.614448, y:635.070293},
pt191: { x:906.614448, y:614.157438},
pt192: { x:914.244415, y:593.366193},
pt193: { x:943.822643, y:607.071684},
pt194: { x:935.674973, y:626.922623},
pt195: { x:735.870034, y:536.774232},
pt196: { x:757.300592, y:503.217802},
pt197: { x:728.240067, y:495.070132},
pt198: { x:728.240067, y:515.982987},
pt199: { x:765.448262, y:523.068741},
pt200: { x:786.552044, y:497.776172},
pt201: { x:786.552044, y:518.689026},
pt202: { x:823.760238, y:497.776172},
pt203: { x:823.760238, y:518.689026},
pt204: { x:962.355174, y:526.324369},
pt205: { x:962.355174, y:547.237223},
pt206: { x:999.563369, y:526.324369},
pt207: { x:999.563369, y:547.237223},
pt208: { x:647.957107, y:502.413889},
pt209: { x:647.957107, y:537.695644},
pt210: { x:528.742852, y:536.771168},
pt211: { x:1222.437204, y:616.586357},
pt212: { x:1222.385923, y:565.767136},
pt213: { x:669.04917, y:374.965621},
pt214: { x:706.390435, y:374.965621},
pt215: { x:669.04917, y:353.062297},
pt216: { x:706.390435, y:353.062297},
pt217: { x:844.908341, y:374.965621},
pt218: { x:882.249607, y:374.965621},
pt219: { x:844.908341, y:353.062297},
pt220: { x:882.249607, y:353.062297},
pt221: { x:904.060837, y:374.965621},
pt222: { x:941.402103, y:374.965621},
pt223: { x:904.060837, y:353.062297},
pt224: { x:941.402103, y:353.062297},
pt225: { x:1021.309535, y:374.965621},
pt226: { x:1058.650801, y:374.965621},
pt227: { x:1021.309535, y:353.062297},
pt228: { x:1058.650801, y:353.062297},
pt229: { x:1080.462031, y:374.965621},
pt230: { x:1117.803297, y:374.965621},
pt231: { x:1080.462031, y:353.062297},
pt232: { x:1117.803297, y:353.062297},
pt233: { x:1004.458845, y:354.756517},
pt234: { x:956.825921, y:354.756517},
pt235: { x:1004.458845, y:373.164104},
pt236: { x:956.825921, y:373.164104},
pt237: { x:962.355174, y:406.655394},
pt238: { x:962.355174, y:448.715089},
pt239: { x:999.563369, y:410.921717},
pt240: { x:999.563369, y:450.384285},
pt241: { x:564.213185, y:533.984945},
pt242: { x:473.26085, y:724.539025},
pt243: { x:488.529794, y:724.539025},
pt244: { x:471.582615, y:682.92879},
pt245: { x:486.851559, y:682.92879},
pt246: { x:503.413994, y:711.804889},
pt247: { x:503.413994, y:696.540187},
pt248: { x:417.338057, y:684.824467},
pt249: { x:402.069112, y:684.824467},
pt250: { x:385.003822, y:684.824467},
pt251: { x:368.948976, y:684.824467},
pt252: { x:417.338057, y:726.434701},
pt253: { x:402.069112, y:726.434701},
pt254: { x:385.003822, y:726.434701},
pt255: { x:368.948976, y:726.434701},
pt256: { x:356.16084, y:697.558603},
pt257: { x:356.16084, y:712.823305},
pt258: { x:786.552044, y:448.715089},
pt259: { x:823.760238, y:410.921717},
pt260: { x:786.552044, y:410.045969},
pt261: { x:823.760238, y:445.11722},
pt262: { x:525.933314, y:431.225046},
pt263: { x:551.614363, y:410.112941},
pt264: { x:1260.130331, y:515.619359},
pt265: { x:1229.151476, y:501.213331},
pt266: { x:1257.294053, y:452.476536},
pt267: { x:1257.706511, y:619.04889},
pt268: { x:551.908887, y:589.451862},
pt269: { x:516.489835, y:590.263286},
pt270: { x:568.710799, y:474.729777},
pt271: { x:534.560923, y:473.725267},
pt272: { x:1223.119253, y:454.538652}
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.025;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!

  function charge(d) {
    return -Math.pow(d.radius+4.5, 2) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.1)
    // .force("link", d3.forceLink(links).id(d => d.id).strength(0.001))
    .force("link", d3.forceLink(links).id(d => d.id).strength(0))
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme

  var fillColor = d3.scaleOrdinal()
      .domain(['Core', 'Architecture and Planning', 'Engineering', 'Humanities, Arts, and Social Sciences', 'Management', 'Science'])
      .range(['#4F4F4F', '#BD1550', '#F37321', '#F8CA00', '#8A9B0F', '#64CCDD']);

  var circleRadius = d3.scaleOrdinal()
      .domain(['Faculty', 'Research Staff', 'Post-doc', 'Graduate Student'])
      .range([10, 5, 5, 2.5]);

  var strokeColor = d3.scaleOrdinal()
      .domain(['Group', 'Huddle', 'Solitary'])
      .range(['#E95AA1', '#87D4ED', '#FAA752']);


  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization researchGroups to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */

  function createNodes(rawData) {

    if (rawData !== undefined) {
    rawDataVar = rawData}

    if (rawData === undefined) {
    rawData = rawDataVar}


    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    var maxAmount = d3.max(rawData, function (d) { return +d.total_amount; });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 35])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.

    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: circleRadius(d.occupantType),
        researchGroup: d.researchGroup,
        bridge: d.bridge,
        discipline: d.discipline,
        position: d.occupantType,
        collaborationType: d.collaborationType,
        floor: d.floor,
        seat: d.seat1,
        seat2: d.seat2,
        seat3: d.seat3,
        x: Math.random() * 1800,
        y: Math.random() * 1000,
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    // myNodes.sort(function (a, b) { return a.researchGroup - b.researchGroup; });


    if (floorFilter !== null) {
    myNodes = myNodes.filter(function(d){return d.floor == floorFilter;});
    }


    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // create link data set from research groups
    var researchGroupMax = d3.max(nodes, function(d) { return +d.researchGroup;} );

    nodes.sort(function (a, b) { return a.researchGroup - b.researchGroup; });

    var researchGroupCounter = []

    for (i = 0; i < researchGroupMax; i++) {
      researchGroupCounter.push([]);
    }

    for (i = 0; i < nodes.length; i++) {
      researchGroupCounter[(nodes[i].researchGroup)-1].push(nodes[i].id);
    }

    for (i = 0; i < researchGroupCounter.length; i++) {
      for (g = 0; g < researchGroupCounter[i].length; g++) {
        var counter = researchGroupCounter[i].length - g;
        for (x = 1; x < counter; x++) {
          var arr = {source: researchGroupCounter[i][g], target: researchGroupCounter[i][g+x]};
          links.push(arr);
        }
      }
    }

    joinedData = {nodes: nodes, links: links}


    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(joinedData.nodes, function (d) { return d.id; })


    connections = svg.selectAll('.connection')
        .data(joinedData.links, function (d) { return d.id; })


    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.

      const connectionsE = svg.append("g")
      .classed('connection', true)
      .attr("stroke", "#000000")
      .attr("opacity", 0.6)
      .attr("stroke-width", 0.1)
      .selectAll("line")
      .data(links)
      .enter().append("line");

      const bubblesE = svg.append("g")
      .classed('bubble', true)
      .attr('stroke-width', 0)
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 0)
      .attr('fill', function (nodes) { return fillColor(nodes.discipline); })
      .attr('stroke', function (nodes) { return strokeColor(nodes.collaborationType); });

      // Create new circle elements each with class `bubble`.
      // There will be one circle.bubble for each object in the nodes array.
      // Initially, their radius (r attribute) will be 0.
      // @v4 Selections are immutable, so lets capture the
      //  enter selection to apply our transtition to below

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    connections = connections.merge(connectionsE);

    // draw links between nodes
    // drawLines();

    // @v4 Merge the original empty selection and the enter selectio

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (nodes) { return nodes.radius; });


    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    // groupBubbles();
    myBubbleChart.toggleDisplay(buttonId);
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y position of their bound node data.
   * These x and y researchGroups are modified by the force simulation.
   */
  function ticked() {
    connections
      .attr('x1', joinedData => joinedData.source.x)
      .attr('y1', joinedData => joinedData.source.y)
      .attr('x2', joinedData => joinedData.target.x)
      .attr('y2', joinedData => joinedData.target.y);
    bubbles
      .attr('cx', joinedData => joinedData.x)
      .attr('cy', joinedData => joinedData.y);
  }


  /*
   * Provides a x position for each node to be used with the split by position
   * x force.
   */
  function nodepositionPosX(d) {
    return positionCenters[d.position].x;
  }

  function nodepositionPosY(d) {
    return positionCenters[d.position].y;
  }

  function nodeBridgeCorePosX(d) {
    return bridgeCoreCenters[d.bridge].x;
  }

  function nodeBridgeCorePosY(d) {
    return bridgeCoreCenters[d.bridge].y;
  }

  function nodeDisciplinePosX(d) {
    return disciplineCenters[d.discipline].x;
  }

  function nodeDisciplinePosY(d) {
    return disciplineCenters[d.discipline].y;
  }

  function nodeResearchGroupPosX(d) {
    return researchGroupCenters[d.researchGroup].x;
  }

  function nodeResearchGroupPosY(d) {
    return researchGroupCenters[d.researchGroup].y;
  }

  function seatingPosX(d) {
    return seatCenters[d.seat].x;
  }

  function seatingPosY(d) {
    return seatCenters[d.seat].y;
  }

  function seating2PosX(d) {
    return seatCenters[d.seat2].x;
  }

  function seating2PosY(d) {
    return seatCenters[d.seat2].y;
  }

  function seating3PosX(d) {
    return seatCenters[d.seat3].x;
  }

  function seating3PosY(d) {
    return seatCenters[d.seat3].y;
  }



  /*
   * Sets visualization in "single group mode".
   * The position labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hidepositionTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));
    simulation.force('charge', d3.forceManyBody().strength(charge));

    if (floorPlanShowing === true){
    document.getElementById("floorPlanBackground").removeChild(floorPlanImage);
    document.getElementById("sliderContainer").removeChild(floorPlanSlider);
    document.getElementById("mostSolitary").innerHTML = "";
    document.getElementById("mostCollaborative").innerHTML = "";
    floorPlanShowing = false;
    }

    // @v4 We can reset the alpha researchGroup and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by position mode".
   * The position labels are shown and the force layout
   * tick function is set to move nodes to the
   * positionCenter of their data's position.
   */
  function splitBubblesPosition() {
    showpositionTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their position centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodepositionPosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodepositionPosY));
    simulation.force('charge', d3.forceManyBody().strength(charge));

    if (floorPlanShowing === true){
    document.getElementById("floorPlanBackground").removeChild(floorPlanImage);
    document.getElementById("sliderContainer").removeChild(floorPlanSlider);
    document.getElementById("mostSolitary").innerHTML = "";
    document.getElementById("mostCollaborative").innerHTML = "";
    floorPlanShowing = false;
    }

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubblesBridgeCore() {
    hidepositionTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their position centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeBridgeCorePosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeBridgeCorePosY));
    simulation.force('charge', d3.forceManyBody().strength(charge));

    if (floorPlanShowing === true){
    document.getElementById("floorPlanBackground").removeChild(floorPlanImage);
    document.getElementById("sliderContainer").removeChild(floorPlanSlider);
    document.getElementById("mostSolitary").innerHTML = "";
    document.getElementById("mostCollaborative").innerHTML = "";
    floorPlanShowing = false;
    }

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubblesDiscipline() {
    hidepositionTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their position centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeDisciplinePosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeDisciplinePosY));
    simulation.force('charge', d3.forceManyBody().strength(charge));

    if (floorPlanShowing === true){
    document.getElementById("floorPlanBackground").removeChild(floorPlanImage);
    document.getElementById("sliderContainer").removeChild(floorPlanSlider);
    document.getElementById("mostSolitary").innerHTML = "";
    document.getElementById("mostCollaborative").innerHTML = "";
    floorPlanShowing = false;
    }

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubblesResearchGroup() {
    hidepositionTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their position centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeResearchGroupPosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeResearchGroupPosY));
    simulation.force('charge', d3.forceManyBody().strength(charge));

    if (floorPlanShowing === true){
    document.getElementById("floorPlanBackground").removeChild(floorPlanImage);
    document.getElementById("sliderContainer").removeChild(floorPlanSlider);
    document.getElementById("mostSolitary").innerHTML = "";
    document.getElementById("mostCollaborative").innerHTML = "";
    floorPlanShowing = false;
    }

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubblesFloorLayout() {
    hidepositionTitles();

      simulation.force('x', d3.forceX().strength(forceStrength).x(seatingPosX));
      simulation.force('y', d3.forceY().strength(forceStrength).y(seatingPosY));

    // @v4 Reset the 'x' force to draw the bubbles to their position centers
    // simulation.force('x', d3.forceX().strength(forceStrength).x(seating2PosX));
    // simulation.force('y', d3.forceY().strength(forceStrength).y(seating2PosY));

    simulation.force('charge', d3.forceManyBody().strength(0));


    if (floorPlanShowing === false){
    floorPlanImage = document.createElement("img");
    floorPlanImage.src = "data/planLayout.png";
    floorPlanImage.setAttribute("height", "541");
    floorPlanImage.setAttribute("width", "1240");
    document.getElementById("floorPlanBackground").appendChild(floorPlanImage);

    floorPlanSlider = document.createElement("input");
    floorPlanSlider.type = "range";
    floorPlanSlider.min = "1";
    floorPlanSlider.max = "3";
    floorPlanSlider.value = "2";
    floorPlanSlider.class = "slider";
    floorPlanSlider.id = "floorSlider";
    document.getElementById("sliderContainer").appendChild(floorPlanSlider);

    floorPlanShowing = true;
    }

    var mostSolitary = document.getElementById("mostSolitary");
    mostSolitary.innerHTML = "MOST SOLITARY";

    var mostSolitary = document.getElementById("mostCollaborative");
    mostCollaborative.innerHTML = "MOST COLLABORATIVE";


    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  var sliderContainer = document.getElementById("sliderContainer");

  sliderContainer.oninput = function() {
    var floorSlider = document.getElementById("floorSlider");
    floorSeatingMode = floorSlider.value;
    console.log(floorSeatingMode);
    if (floorSeatingMode == 1){
    simulation.force('x', d3.forceX().strength(forceStrength).x(seating2PosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(seating2PosY));
    simulation.alpha(1).restart();}
    else if (floorSeatingMode == 2){
    simulation.force('x', d3.forceX().strength(forceStrength).x(seatingPosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(seatingPosY));
    simulation.alpha(1).restart();}
    else if (floorSeatingMode == 3){
    simulation.force('x', d3.forceX().strength(forceStrength).x(seating3PosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(seating3PosY));
    simulation.alpha(1).restart();}
}


  /*
   * Hides position title displays.
   */
  function hidepositionTitles() {
    svg.selectAll('.position').remove();
  }

  /*
   * Shows position title displays.
   */
  function showpositionTitles() {
    // Another way to do this would be to create
    // the position texts once and then just hide them.
    var positionsData = d3.keys(positionsTitleX);
    var positions = svg.selectAll('.position')
      .data(positionsData);

    positions.enter().append('text')
      .attr('class', 'position')
      .attr('x', function (d) { return positionsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    // d3.select(this).attr('stroke', 'black');
    // d3.select(this).attr('stroke-width', 0);

    var content = '<span class="name">Position: </span><span class="researchGroup">' +
                  joinedData.nodes.position +
                  '</span><br/>' +
                  '<span class="name">Bridge / Core: </span><span class="researchGroup">' +
                  joinedData.nodes.bridge +
                  '</span><br/>' +
                  '<span class="name">Discipline: </span><span class="discipline">' +
                  (joinedData.nodes.discipline) +
                  '</span><br/>' +
                  '<span class="name">Research Group: </span><span class="researchGroup">' +
                  (joinedData.nodes.researchGroup) +
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    // d3.select(this)
    //   .attr('stroke', d3.rgb(fillColor(d.discipline)).darker());

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by position" modes.
   *
   * displayName is expected to be a string and either 'position' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'position') {
      splitBubblesPosition();
    }
    else if (displayName === 'bridgeCore') {
      splitBubblesBridgeCore();
    }
    else if (displayName === 'discipline') {
    splitBubblesDiscipline()
    }
    else if (displayName === 'researchGroup') {
    splitBubblesResearchGroup()
    }
    else if (displayName === 'floorLayout') {
    splitBubblesFloorLayout()
    }
    else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

// shout out to Favian my boi

function updateFloorFilter(buttonID){
  if (buttonID === 'floor3') {
    floorFilter = 3;
    d3.selectAll("svg").exit();
    d3.selectAll("svg").remove();
    myBubbleChart('#vis', rawData);
    showCollabType();}
  else if (buttonID === 'floor4') {
    floorFilter = 4;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else if (buttonID === 'floor5') {
    floorFilter = 5;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else if (buttonID === 'floor6') {
    floorFilter = 6;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else if (buttonID === 'floor7') {
    floorFilter = 7;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else if (buttonID === 'floor8') {
    floorFilter = 8;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else if (buttonID === 'floor9') {
    floorFilter = 9;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else if (buttonID === 'floor10') {
    floorFilter = 10;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
  else {
    floorFilter = null;
    myBubbleChart('#vis', rawData);
    d3.select('#vis svg').remove();
    showCollabType();}
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });

  d3.select('#floorSel')
      .selectAll('.floorButton')
      .on('click', function () {
        // Remove active class from all buttons
        d3.selectAll('.floorButton').classed('active', false);
        // Find the button just clicked
        var floorButton = d3.select(this);

        // Set it as the active button
        floorButton.classed('active', true);

        // Get the id of the button
        var floorButtonId = floorButton.attr('id');

        // Toggle the bubble chart based on
        // the currently clicked button.
        updateFloorFilter(floorButtonId);
      });
}


function showCollabType() {
  // Get the checkbox
  var checkBox = document.getElementById("checkCollab");

  if (checkBox.checked == true){
    bubbles = d3.selectAll('.bubble')
    .attr('stroke-width', 4);}
    else {
      bubbles = d3.selectAll('.bubble')
      .attr('stroke-width', 0);}
    }

function drawLinks() {
  // Get the checkbox
  var linksCheckBox = document.getElementById("checkLinks");

  if (linksCheckBox.checked == true){
    connections = d3.selectAll('.connection')
    .attr('opacity', 0.2);}
  else {
    bubbles = d3.selectAll('.connection')
    .attr('opacity', 0);}}


  function drawNodes() {
    // Get the checkbox
    var nodesCheckBox = document.getElementById("checkNodes");

      if (nodesCheckBox.checked == true){
        bubbles = d3.selectAll('.bubble')
        .attr('opacity', 1);}
      else {
        bubbles = d3.selectAll('.bubble')
        .attr('opacity', 0);}}



// Load the data.
d3.csv('data/networkNodes_updated.csv', display);

// setup the buttons.
setupButtons();
