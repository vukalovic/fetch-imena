const prethodnePretrageText = document.getElementById("rezultatiprije");
const rezultatiPretrageText = document.getElementById("rezultatisada");
const button = document.getElementById("botunZaSlanje");
const regionNamesInCroatian = new Intl.DisplayNames(["hr"], { type: "region" });


button.addEventListener("click", dohvatiPodatke);

document
  .getElementById("botunZaSlanje")
  .addEventListener("click", dohvatiPodatke);

/*dohvacamo polje za upisivanje, stavljamo listenera na focus event*/
document.getElementById("basic-url")

  .addEventListener("focus", onInputFocus);

/*svaki put kad se basic-url fokusira, poziva se ova funkcija */
function onInputFocus(event) {
  /*uzimam element koji je fokusian*/
  const target = event.target
  /*postavljam vrijednost na prazan string*/
  target.value = ""
}

function dohvatiPodatke(event) {
  event.preventDefault();
  let unos = event.target.previousElementSibling.value;
  fetch(`https://api.nationalize.io/?name=${unos}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      prikaziNoveRezultate(data);
    });
}

function prikaziNoveRezultate(data) {
  if (data.country[0] === undefined) {
    rezultatiPretrageText.innerHTML = `${data.name} je ime koje se ne nalazi u bazi`;
    prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light" id="main-btn">${data.name}</button> `
    //prethodnePretrageText.innerHTML += `<button type="button" class="btn btn-light undefined_btn" id="main-btn">${data.name}</button>`;
  }
  else {
    /*prikazuje array s apia*/
    const rezultati = data.country
    rezultatiPretrageText.innerHTML = `Vjerovatnost da je ${data.name} iz zemlje:`
    for (const item of rezultati) {
      /*for...of za iteriranje kroz array , for...in je za iteriranje kroz propertye objekta*/
      /* for će se iterirat onoliko puta koliko je itema u arrayu*/
      /*math.round zaokružuje*/
      rezultatiPretrageText.innerHTML += generateListItem(item.country_id, item.probability);

    }

    prethodnePretrageText.innerHTML += generateButton(data.name, rezultati)

  }


}

/*funkcija prima dva parametra (countryCode i probability), vraća string koji je li i 
upisuje vrijednosti iz parametara (countryCode i probability) u taj list item koji vraća */
function generateListItem(countryCode, probability) {
  return `<li>${regionNamesInCroatian.of(countryCode)} - ${Math.round(probability * 100)} %</li>`
}

/*funkacija koja generira buttton iz dva parametra gdje je prvi parametar name, 
a drugi parametar je array rezultati (74 linija). Rezultati mi sadrže country_id i probability*/
function generateButton(name, rezultati) {
  /*otvori button HTML*/
  let button = `<button type="button" class="btn btn-light" id="btn" onclick="rezultatKlika(${name})"> ${name} = `;
  /*iteriraj mi kroz rezultate (74linija) i za svaki rezultat mi nakači tekst u button*/
  for (const item of rezultati) {
    button += `${regionNamesInCroatian.of(item.country_id)} - ${Math.round(item.probability * 100)} %`
  }
  /*vrati mi zatvoreni button*/
  return button += '</button>'
}

function rezultatKlika(name, rezultati) {
  const text = `Već si pretražio ${name} a rezultati su: `
  for (const item of rezultati) {
    text += `${regionNamesInCroatian.of(item.country_id)} - ${Math.round(item.probability * 100)} %`
  }
  rezultatiPretrageText.innerHTML = text;
}