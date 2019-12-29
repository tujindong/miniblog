/* eslint-disable indent */
const strategies = {
    isNonEmpty (value, errorMsg) {
        return !value ? errorMsg : void 0
    }
}

export default class validator {
    constructor () {
        this.cache = []
    }

    add (value, rules) {
        for (let rule of rules) {
            let strategyAry = rule.strategy.split(':')
            let errorMsg = rule.errorMsg
            this.cache.push(() => {
                let strategy = strategyAry.shift()
                strategyAry.unshift(value)
                strategyAry.push(errorMsg)
                return strategies[strategy].apply(value, strategyAry)
            })
        }
    }

    start () {
        for (let validatorFunc of this.cache) {
            let errorMsg = validatorFunc()
            if (errorMsg) {
                return errorMsg
            }
        }
    }
}
