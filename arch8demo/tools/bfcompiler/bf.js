class bf {
    compile = function(inp)
    {
        let out = "lda,#8000;\n";
        for(let i=0; i<inp.length; i++)
        {
            out+=this.getinst(inp[i]);
        }
        return out;
    }

    getinst = function(inst)
    {
        switch(inst)
        {
            default:
                return "";
            case "+":
                return "lw,a,inx;\nadd,a,1;\nsw,inx,a;";
            case "-":
                return "lw,a,inx;\nsub,a,1;\nsw,inx,a;";
        }
    }
}