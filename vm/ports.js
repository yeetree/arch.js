//Arch.js Ports:
//This allows for Arch.js programs to communicate with things outside
//of the cpu, like keyboards and displays.

class ports
{
    ports = [];

    constructor()
    {
        this.ports[0] = new consoletty();
    };

    in = async function(port, data)
    {
        this.ports[port].in(data);
    };

    out = async function(port, th)
    {
        return this.ports[port].out(th);
    };
}

class port
{
    constructor()
    {

    }

    in = async function(num)
    {

    }

    out = async function(th)
    {

    }
}

class consoletty extends port
{
    ascii = [
        '','&#01;','&#02;','&#03;','&#04;','&#05;','&#06;','&#;07',
        '&#08;','&#09;','&#10;','&#11;','&#12;','&#13;','&#14;','&#15;',
        '&#16;','&#17;','&#18;','&#19;','&#20;','&#21;','&#22;','&#23;',
        '&#24;','&#25;','&#26;','&#27;','&#28;','&#29;','&#30;','&#31',
        ' ', '!', '"', '#', '$', '%', '&', '\'',
        '(', ')', '*', '+', ',', '-', '.', '/',
        '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', ':', ';', '<', '=', '>', '?',
        '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'L', 'S', 'T', 'U', 'V', 'W',
        'X', 'Y', 'Z', '[', '\\' ,']', '^', '_',
        '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
        'x', 'y', 'z', '{', '|', '}', '~', ''
    ];

    waitkey = function(th, th2)
    {
        return new Promise((resolve) => {
            //th.stop();
            var term = document.getElementById("console")

            term.addEventListener("keydown", keyhandler);
            function keyhandler(e)
            {
                if(e.key.length == 1)
                {
                    //th.start();
                    term.removeEventListener("keydown", keyhandler)
                    let ret = 0;
                    if(th2.ascii.indexOf(e.key) != -1)
                        ret=th2.ascii.indexOf(e.key)
                    resolve(ret);
                }
                else if(e.key == "Enter")
                {
                    //th.start();
                    term.removeEventListener("keydown", keyhandler)
                    resolve(13);
                }
            }
        });
    };

    out = async function(th)
    {
        return this.waitkey(th, this);
    };

    in = async function(num)
    {
        document.getElementById("console").innerHTML += this.ascii[num];
    };

}