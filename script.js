/* get element references */
const inputFormEl = document.getElementById("input-form")
const clearInputEl = document.getElementById("clear-input")

const amountEl = document.getElementById("amount")
const termEl = document.getElementById("term")
const rateEl = document.getElementById("rate")
const typeEl = document.getElementById("type")

const repaymentEl = document.getElementById("repayment-option")
const interestOnlyEl = document.getElementById("interest-only-option")
const calculateBtnEl = document.getElementById("calculate-btn")

const resultSectionEl = document.getElementById("result-section")
const resultSectionEmptyEl = document.getElementById("result-section-empty")
const resultInfoEl = document.getElementById("result-info")
const emptyResultInfoEl = document.getElementById("empty-result-info")

const monthlyValueEl = document.getElementById("mortgage-monthly-value")
const totalValueEl = document.getElementById("mortgage-total-value")
const monthlyHeadingEl = document.getElementById("mortgage-monthly-heading")
const totalHeadingEl = document.getElementById("mortgage-total-heading")


/* arrays */
const fields = { amount: amountEl, term: termEl, rate: rateEl, type: typeEl }


/* event listners */
for (const field in fields) {
    fields[field].addEventListener("change", (event) => {
        if (event.currentTarget.value)
            fields[field].classList.remove("empty")
        if (event.currentTarget === typeEl && event.currentTarget.querySelector("input:checked") !== null)
            typeEl.classList.remove("empty")
    })
}

repaymentEl.addEventListener("click", () => {
    calculateBtnEl.innerHTML = `
    <figure>
        <img src="./assets/images/icon-calculator.svg" alt="calculator icon">
    </figure>
    Calculate Repayments`
    emptyResultInfoEl.textContent = emptyResultInfoText("repayments")
})


interestOnlyEl.addEventListener("click", () => {
    calculateBtnEl.innerHTML = `
    <figure>
        <img src="./assets/images/icon-calculator.svg" alt="calculator icon">
    </figure>
    Calculate Interest`
    emptyResultInfoEl.textContent = emptyResultInfoText("interest")

})


inputFormEl.addEventListener("submit", (event) => {
    event.preventDefault()
    clearAllEmptyErrorTags()
    const formData = Object.fromEntries(new FormData(inputFormEl))

    let isEmpty = false
    for (const field in fields) {
        if (!formData[field]) {
            fields[field].classList.add("empty")
            isEmpty = isEmpty || true
        }
    }
    if (isEmpty) return

    const { emi, total } = calculateMortgage(formData)
    const options = { style: "currency", currency: "USD" }
    monthlyValueEl.textContent = `${emi.toLocaleString("en-US", options)}`
    totalValueEl.textContent = `${total.toLocaleString("en-US", options)}`

    if (formData.type === "repayment") runRepaymentSteps()
    else if (formData.type === "interest-only") runInterestOnlySteps()
    else typeEl.classList.add("empty")

    resultSectionEl.classList.remove("hide")
    resultSectionEmptyEl.classList.add("hide")
})

clearInputEl.addEventListener("click", () => {
    resultSectionEl.classList.add("hide")
    resultSectionEmptyEl.classList.remove("hide")
    clearAllEmptyErrorTags()
    inputFormEl.reset()
})



/* function definitions */
function resultInfoText(typeText) {
    return `Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate ${typeText}” again.`
}

function emptyResultInfoText(typeText) {
    return `Complete the form and click “calculate ${typeText}” to see what your monthly ${typeText} would be.`
}


function clearAllEmptyErrorTags() {
    for (const field in fields) {
        fields[field].classList.remove("empty")
    }
}


function runRepaymentSteps() {
    monthlyHeadingEl.textContent = "Your monthly repayments"
    totalHeadingEl.textContent = "Total you'll repay over the term"
    resultInfoEl.textContent = resultInfoText("repayments")
}


function runInterestOnlySteps() {
    monthlyHeadingEl.textContent = "Your monthly interest"
    totalHeadingEl.textContent = "Total interest over the term"
    resultInfoEl.textContent = resultInfoText("interest")
}


function calculateMortgage(formData) {
    const { amount, rate, term, type } = formData
    console.log(formData)
    let emi = 0, total = 0;
    if (type === "repayment") {
        emi = (amount * rate / 1200) /
            (1 - Math.pow(1 + rate / 1200, -term * 12))
        total = emi * term * 12

    } else {
        emi = (amount * rate / 1200)
        total = emi * term * 12
    }
    return { emi, total }
}
