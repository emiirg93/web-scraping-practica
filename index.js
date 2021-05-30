const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    console.log('empezando scrapper ...');

    // lanza el navegador
    const browser = await puppeteer.launch({
        /* // muestra el procedimiento
        headless: false,
        // corre el codigo mas lento
        slowMo: 500, */
    });

    const page = await browser.newPage();
    const casas = [];

    await page.goto('https://nextviaje.vercel.app/');

    const urls = await page.evaluate(() =>
        Array.from(
            document.querySelectorAll('.FilaCasas__cartas a'),
            (nodo) => nodo.href
        )
    );

    for (const url of urls) {
        await page.goto(url);
        const detallesCasa = await page.evaluate(() => {
            const imgs = [
                ...document.querySelectorAll('.CasaVista__fotos img'),
            ].map((img) => img.src);

            const titulo =
                document.querySelector('.CasaVista__titulo').innerText;
            const ubicacion = document.querySelector(
                '.CasaVista__titulo + div'
            ).innerText;
            const precio = Number(
                document
                    .querySelector('.CasaVista__precio')
                    .innerText.replace(/[^0-9]/g, '')
            );

            const comodidades = [
                ...document.querySelectorAll('.CasaVista__cuartos span'),
            ].reduce((acc, comodidad) => {
                const [cantidad, nombre] = comodidad.innerText.split(' ');
                acc[nombre] = Number(cantidad);

                return acc;
            }, {});

            const servicios = [
                ...document.querySelectorAll('.CasaVista__extra'),
            ].map((nodo) => nodo.innerText.toLowerCase());

            const numeroEstrellas = Number(
                document.querySelector('.Opiniones__numero-de-estrellas')
                    .innerText
            );
            const numeroOpiniones = Number(
                document
                    .querySelector('.Opiniones__numero-de-opiniones')
                    .innerText.replace(/[^0-9]/g, '')
            );

            const url = window.location.href;

            const opiniones = [...document.querySelectorAll('.Opinion')].map(
                (nodo) => {
                    const [nombrePersona, fecha, comentario] =
                        nodo.innerText.split('\n');
                    return {
                        nombrePersona,
                        fecha,
                        comentario,
                    };
                }
            );

            console.log(opiniones);

            return {
                imgs,
                titulo,
                ubicacion,
                precio,
                comodidades,
                servicios,
                numeroEstrellas,
                numeroOpiniones,
                opiniones,
                url,
            };
        });

        casas.push(detallesCasa);
    }

    const data = JSON.stringify(casas);

    fs.writeFileSync(path.join(__dirname,'casas.json'), data);

    await browser.close();
    process.exit();
})();
