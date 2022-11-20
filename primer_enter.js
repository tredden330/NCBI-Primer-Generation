const fs = require('fs');
const robot = require('robotjs');
var carrotArray = [];
var individualSequences = [];

var startIndex = 0;
var index = startIndex;
var numSequences = 215;

//setInterval(mousePos, 100);

enterGeneSequences();
logPrimerSequences();
//cleanup();
//singlePrimersFile();

function singlePrimersFile() {
    fs.readFile('C:/Users/tom/OneDrive/Desktop/Lab_Notes/datasets/Nodulation_Genes/primers_cleaned.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        hits = segmentByString("\n\n", data);
        console.log(hits.length)
        genes = []
        fwdPrimers = []
        revPrimers = []

        for (var i = 0; i < hits.length; i++) {
            genes.push(hits[i].substring(2, 15));

            fwdPrimerLine = hits[i].substring(168, 200)
            //console.log(genes.length)
           // console.log(hits[i].substring(220, 250))
            //console.log(hits[i].substring(300, 310))
        }
    });



    
}

function enterGeneSequences() {
    fs.readFile('C:/Users/tom/OneDrive/Desktop/Lab_Notes/datasets/Nodulation_Genes/Nodulation_Genes_DNA_Sequence.fasta', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        readFasta(data);
    });
}

function readFasta(data) {

    individualSequences = segmentByString(">", data);
    typeSequences(individualSequences);
}

async function typeSequences(data) {

    if (index == startIndex) {
        for (var i = 0; i < 10; i++) {
            console.log("Navigate to chrome! The robot begins in " + (10 - i) + " seconds!");
            await sleep(1000);
        }
    } else {
        await sleep(500);
    }

    robot.setKeyboardDelay(5);

    robot.moveMouseSmooth(746, 84);
    robot.mouseClick();
    robot.moveMouseSmooth(300, 440);
    robot.mouseClick();

    var subdivisionsArray = [];
    var subdivisions = Math.ceil(data[index].length / 1000)

    if (subdivisions !== 1) {
        for (var s = 0; s < subdivisions; s++) {
            subdivisionsArray.push(data[index].substring(s * 1000, (s + 1) * 1000))
        }

        for (var t = 0; t < subdivisions; t++) {
            robot.typeString(subdivisionsArray[t]);
            await sleep(5000)
        }
    } else {
        robot.typeString(data[index]);
    }

    for (var i = 0; i < 14; i++) {
        robot.keyTap("tab");
    }

    minSize = Math.round(data[index].length - 80 - data[index].length/10)
    robot.typeString(minSize.toString());
    
    robot.keyTap("tab")

    robot.typeString("40000");

    for (var i = 0; i < 28; i++) {
        robot.keyTap("tab");
    }

    robot.typeString("Medicago tru");
    await sleep(5000); //the website does not respond fast enough, need to wait a sec
    robot.keyTap("down");
    robot.keyTap("down");   

    for (var i = 0; i < 11; i++) {
        robot.keyTap("tab");
    }

    robot.typeString("40000")

    for (var i = 0; i < 4; i++) {
        robot.keyTap("tab");
    }

    await sleep(1000);
    robot.keyTap("enter");

    await sleep(2000);
    robot.keyTap("t", "control");

    index++;

    console.log("finished gene: " + index);
    if (index < numSequences) {
        typeSequences(data);
    } 
}

async function logPrimerSequences() {

    for (var i = 0; i < 10; i++) {
        console.log("robot will take over and read in " + (10 - i));
        await sleep(1000);
    }
    robot.setKeyboardDelay(50);

    robot.moveMouseSmooth(18, 848);
    robot.mouseClick();
    await sleep(1000);
    robot.typeString("no");
    await sleep(1000);
    robot.keyTap("enter");
    await sleep(1000);
    robot.keyTap("tab", "alt");
    await sleep(1000);

    for (var i = 0; i < numSequences; i++) {
        robot.keyTap("a", "control");
        robot.keyTap("c", "control");

        robot.keyTap("tab", "alt");

        robot.moveMouseSmooth(600, 500);
        robot.mouseClick();
        robot.keyTap("a", "control");
        robot.keyTap("down");
        robot.keyTap("v", "control");
        robot.keyTap("enter");
        robot.keyTap("enter");
        robot.keyTap("tab", "alt");
        await sleep(1000);
        robot.keyTap("tab", "control");
    }

    robot.keyTap("tab", "alt");
    robot.keyTap("s", "control");
    robot.typeString("primer_pairs_raw.txt");
    await sleep(100);
    robot.keyTap("enter");
    await sleep(100);
    robot.keyTap("left");
    await sleep(100);
    robot.keyTap("enter");
}

function cleanup() {
    fs.readFile('C:/Users/tom/OneDrive/Desktop/Lab_Notes/datasets/Nodulation_Genes/primer_pairs_raw.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        cleanupPrimers(data);
    });
}

function cleanupPrimers(data) {

    segments = segmentByString("Input", data);

    var primers = [];
    var locus = [];

    for (var i = 0; i < segments.length; i++) {

        locus.push(segments[i].substring(18, 48));

        primer1index = segments[i].search("Primer pair 1");
        primer2index = segments[i].search("Primer pair 2");

        if (primer2index == -1) {
            primers.push(segments[i].substring(primer1index, 500));
        } else {
            primers.push(segments[i].substring(primer1index, primer2index));
        }
    }

    var locusAndPrimers = "";

    for (var i = 0; i < locus.length; i++) {

        locusAndPrimers = locusAndPrimers.concat(locus[i])
        locusAndPrimers = locusAndPrimers.concat("\n")
        locusAndPrimers = locusAndPrimers.concat(primers[i])
        locusAndPrimers = locusAndPrimers.concat("\n")
        
    }

    console.log(locusAndPrimers)
    fs.writeFile("C:/Users/tom/OneDrive/Desktop/Lab_Notes/datasets/Nodulation_Genes/primers_cleaned.txt", locusAndPrimers, (err) => {

    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mousePos() {
    mousePos = robot.getMousePos();
    console.log(mousePos);
}

function segmentByString(query, input) {

    indicies = [];

    for (var i = 0; i < input.length; i++) {

        for (var j = 0; j < query.length; j++) {

            var isSame = true;
            if (input[i + j] !== query[j]) {
                isSame = false;
                break;
            }
        }

        if (isSame) {
            indicies.push(i);
        }
    }

    individualSegments = []

    for (var i = 1; i < indicies.length; i++) {
        currentSequence = input.substring(indicies[i - 1], indicies[i]);
        individualSegments.push(currentSequence);
    }

    return individualSegments;
}