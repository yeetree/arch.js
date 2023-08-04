function initFontTable() {
    let id=0;
    let newrow = "";
    let table = document.getElementById("table");
    for(let i=0; i<8; i++)
    {
        newrow="<tr>"
        newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
        id+=1;
        newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
        id+=1;
        newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
        id+=1;
        newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
        id+=1;
        newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
        id+=1;
        newrow+="<td><input type=\"checkbox\" id=\"" + id.toString() + "\"></td>";
        id+=1;
        newrow+="</td>";
        table.innerHTML+=newrow;
    }
}

function getData()
{
    let out = "";
    for(let i=0; i<48; i++)
    {
        if(document.getElementById(i.toString()).checked)
            out+="1";
        else
            out+="0";
    }
    return out;
}

function setData(inp)
{
    inp=inp.value;
    console.log(inp)
    for(let i=0; i<48; i++)
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
    for(let i=0; i<48; i++)
    {
        document.getElementById(i.toString()).checked = false;
    }
    return out;
}