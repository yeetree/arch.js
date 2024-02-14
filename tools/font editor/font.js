function initFontTable(w = 8, h = 8) {
    charw = w;
    charh = h;
    let id=0;
    let newrow = "";
    let table = document.getElementById("table");
    table.innerHTML = "";
    for(let i=0; i<h; i++)
    {
        newrow="<tr>"

        for(let e=0; e<w; e++) {
            newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
            id+=1;
        }

        newrow+="</td>";
        table.innerHTML+=newrow;
    }
}

function getData()
{
    let out = "";
    for(let i=0; i<charh * charw; i++)
    {
        if(document.getElementById(i.toString()).checked)
            out+="1";
        else
            out+="0";
    }

    let outarr = out.match(/......../g)
    for(let i = 0; i<outarr.length; i++) {
        outarr[i] = parseInt(outarr[i], 2);
    }

    outarr.length = Math.ceil((charh * charw) / 8);;
    for(let i = 0; i<outarr.length; i++) {
        if(!outarr[i]) {
            outarr[i] = 0;
        }
    }

    out = outarr.join(',') + ","

    return out;
}

function setData(inp, w = 8, h = 8)
{
    inp=inp.value;
    console.log(inp)

    let inparr = inp.split(',');
    inparr.length = Math.ceil((charh * charw) / 8);
    for(let i = 0; i<inparr.length; i++) {
        inparr[i] = parseInt(inparr[i]).toString(2).padStart(8, '0');
    }

    inp = inparr.join('');

    for(let i=0; i<charh * charw; i++)
    {
        if(inp[i] == "1")
        {
            document.getElementById(i.toString()).checked = true;
        }
        else
        {
            document.getElementById(i.toString()).checked = false;
        }
    }
}

function cleard()
{
    for(let i=0; i<charh * charw; i++)
    {
        document.getElementById(i.toString()).checked = false;
    }
    return out;
}