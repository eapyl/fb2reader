/// VIEW
var txt = document.querySelectorAll('.text')[0];
var txtStyler = popmotion.styler(txt);
var main_window = document.querySelectorAll('.marquee')[0];
var main_windowStyler = popmotion.styler(main_window);
var book_title = document.getElementById('book-title');
var section_title = document.getElementById('section-title');
var drop_zone = document.getElementById('drop-zone');

var speed_up = document.getElementById('speed-up');
var speed_down = document.getElementById('speed-down');

var to_begin = document.getElementById('to-begin');
var prev_chapter = document.getElementById('prev-chapter');
var prev_paragraph = document.getElementById('prev-paragraph');
var pause = document.getElementById('pause');
var next_paragraph = document.getElementById('next-paragraph');
var next_chapter = document.getElementById('next-chapter');
var to_end = document.getElementById('to-end');

var input_file = document.getElementById('upload');

/// MODEL
var paused = false;
var currentPosition = {left: 0, section: 0, p: 0};
var book = {sections: []};
var speed = 1;
const INITIAL_MERGE = main_windowStyler.get('width');

/// SAVED MODEL
var savedPosition = localStorage.getItem('fb2reader_position');
var savedBook = localStorage.getItem('fb2reader_book');
var savedSpeed = localStorage.getItem('fb2reader_speed');

if (savedSpeed)
{
    speed = parseInt(savedSpeed);
}

if (savedBook && savedPosition)
{
    currentPosition = JSON.parse(savedPosition);
    book = JSON.parse(savedBook);

    if (book.sections.length > 0)
    {
        if (currentPosition.section >= book.sections.length -1)
        {
            currentPosition.section = 0;
        }

        if (currentPosition.p >= book.sections[currentPosition.section].length - 1)
        {
            currentPosition.p = 0;
        }

        txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
        txtStyler.set('left', parseInt(currentPosition.left) + 50);
        section_title.innerText = book.sections[currentPosition.section].title ? " " + book.sections[currentPosition.section].title.trim() : "";
        book_title.innerText = book.title;
    }
}

/// MAIN CYCLE
popmotion.everyFrame().start((v) => {
    if (!paused && book.sections.length > 0)
    {
        var currentLeft = txtStyler.get('left');
        if (Math.abs(currentLeft) < txtStyler.get('width') - (isLastParagraph() ? main_windowStyler.get('width') : 0))
        {
            txtStyler.set('left', txtStyler.get('left') - (1 * speed));
        }
        else if (currentPosition.p < book.sections[currentPosition.section].p.length - 1)
        {
            currentPosition.p++;
            currentPosition.left = INITIAL_MERGE;
            txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
            txtStyler.set('left', currentPosition.left);
        }
        else if (currentPosition.section < book.sections.length - 1)
        {
            currentPosition.p = 0;
            currentPosition.left = INITIAL_MERGE;
            currentPosition.section++;
            txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
            section_title.innerText = book.sections[currentPosition.section].title ? book.sections[currentPosition.section].title.trim() : "";
            txtStyler.set('left', currentPosition.left);
        }
    }
});

function isLastParagraph() { return currentPosition.section == book.sections.length - 1 && currentPosition.p == book.sections[currentPosition.section].p.length - 1; }

/// EVENTS
window.onpageshow = window.onpagehide
    = window.onfocus = window.onblur = onchange;

function onchange (evt) {
    var v = "visible", h = "hidden",
    evtMap = {
        focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
    };

    evt = evt || window.event;
    if (evt.type in evtMap && evtMap[evt.type] === 'hidden')
        paused = true;
    else if (evt.type in evtMap && evtMap[evt.type] === 'visible')
        paused = false;
    else if (this[hidden] === "hidden")
        paused = true;
    else if (this[hidden] === "visible")
        paused = false;
}

speed_up.addEventListener('click', (e)=> speed = speed < 5 ? speed + 1 : speed);
speed_down.addEventListener('click', (e)=> speed = speed > 1 ? speed - 1: speed);

pause.addEventListener('click', (e) => pauseReading());

to_begin.addEventListener('click', (e) =>
{
    currentPosition.p = 0;
    currentPosition.left = INITIAL_MERGE;
    currentPosition.section = 0;
    txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
    txtStyler.set('left', currentPosition.left);
    section_title.innerText = book.sections[currentPosition.section].title ? book.sections[currentPosition.section].title.trim() : "";
});

to_end.addEventListener('click', (e) =>
{
    currentPosition.p = book.sections[book.sections.length - 1].p.length - 1;
    currentPosition.section = book.sections.length - 1;
    txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
    currentPosition.left = -1 * (txtStyler.get('width') - main_windowStyler.get('width'));
    txtStyler.set('left', currentPosition.left);
    section_title.innerText = book.sections[currentPosition.section].title ? book.sections[currentPosition.section].title.trim() : "";
});

next_chapter.addEventListener('click', (e) =>
{
    if (currentPosition.section < book.sections.length - 1)
    {
        currentPosition.section++;
    }
    currentPosition.p = 0;
    currentPosition.left = INITIAL_MERGE;
    txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
    txtStyler.set('left', currentPosition.left);
    section_title.innerText = book.sections[currentPosition.section].title ? book.sections[currentPosition.section].title.trim() : "";
});

prev_chapter.addEventListener('click', (e) =>
{
    if (currentPosition.section > 0)
    {
        currentPosition.section--;
    }
    currentPosition.p = 0;
    currentPosition.left = INITIAL_MERGE;
    txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
    txtStyler.set('left', currentPosition.left);
    section_title.innerText = book.sections[currentPosition.section].title ? book.sections[currentPosition.section].title.trim() : "";
});

next_paragraph.addEventListener('click', (e) =>
{
    if (currentPosition.p < book.sections[currentPosition.section].p.length - 1)
    {
        currentPosition.p++;
    }
    currentPosition.left = INITIAL_MERGE;
    txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
    txtStyler.set('left', currentPosition.left);
});

prev_paragraph.addEventListener('click', (e) =>
{
    if (currentPosition.p > 0)
    {
        currentPosition.p--;
    }
    currentPosition.left = INITIAL_MERGE;
    txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
    txtStyler.set('left', currentPosition.left);
});

drop_zone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

input_file.addEventListener('change', (e) => loadFiles(e.target.files));

drop_zone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
});

var mx = 0;
var tempPosition = 0;
var movingUsingMouse = false;
var movingUsingTouch = false;

main_window.addEventListener('mousedown', mouseDown);
main_window.addEventListener('touchstart', touchStart);

document.body.addEventListener('mouseup', mouseUp);
main_window.addEventListener('touchend', touchEnd);

/// PRIVATE FUNCTIONS
function loadFiles(files)
{
    if (files.length > 0)
    {
        var file = files[0];
        if (file.name.endsWith('fb2')) {
            var reader = new FileReader();
            reader.onload = function(e2) {
                // finished reading file data.
                parseBook(e2.target.result);
                currentPosition.left = INITIAL_MERGE;
                currentPosition.section = 0;
                currentPosition.p = 0;
                txt.innerHTML = book.sections[currentPosition.section].p[currentPosition.p];
                txtStyler.set('left', currentPosition.left);
                localStorage.setItem('fb2reader_book', JSON.stringify(book));
                book_title.innerText = book.title;
            }

            reader.readAsText(file); // start reading the file data.
        }
    }
}

function parseBook(xml)
{
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "text/xml");
    book.title = xmlDoc.getElementsByTagName("book-title")[0].textContent;
    var sections = xmlDoc.getElementsByTagName("body")[0].getElementsByTagName('section');
    book.sections = [];
    for (var i = 0; i < sections.length; i++) {
        var section = {p: []};
        var current = sections[i];
        var sectionTitle = current.getElementsByTagName("title");
        if (sectionTitle.length > 0)
        {
            section.title = current.getElementsByTagName("title")[0].textContent;
        }
        var pArray = current.getElementsByTagName('p');
        for (var j =0; j < pArray.length; j++)
        {
            var p = pArray[j];
            if (p.textContent != '' && p.textContent != "\n")
            {
                section.p.push(p.textContent);
            }
        }
        book.sections.push(section);
    }
}

function pauseReading()
{
    paused = !paused;
    if (paused)
    {
        currentPosition.left = txtStyler.get('left');
        localStorage.setItem('fb2reader_position', JSON.stringify(currentPosition));
    }
}

function mouseMove(e)
{
    if (e.pageX > mx) {
        txtStyler.set('left', tempPosition+=15);
    } else {
        txtStyler.set('left', tempPosition-=15);
    }
    mx = e.pageX;
}

function mouseDown(e)
{
    movingUsingMouse = true;
    paused = true;
    mx = e.pageX;
    tempPosition = txtStyler.get('left');
    main_window.addEventListener('mousemove', mouseMove);
}

function mouseUp(e)
{
    if (movingUsingMouse)
    {
        main_window.removeEventListener('mousemove', mouseMove);
        paused = false;
        tempPosition = 0;
        movingUsingMouse = false;
    }
}

function touchMove(e)
{
    if (e.changedTouches[0].pageX > mx) {
        txtStyler.set('left', tempPosition+=15);
    } else {
        txtStyler.set('left', tempPosition-=15);
    }
    mx = e.changedTouches[0].pageX;
}

function touchStart(e)
{
    movingUsingTouch = true;
    paused = true;
    mx = e.changedTouches[0].pageX;
    tempPosition = txtStyler.get('left');
    main_window.addEventListener('touchmove', touchMove);
}

function touchEnd(e)
{
    if (movingUsingTouch)
    {
        main_window.removeEventListener('touchmove', touchMove);
        paused = false;
        tempPosition = 0;
        movingUsingTouch = false;
    }
}