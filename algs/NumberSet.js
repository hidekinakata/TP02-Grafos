class NumberSet extends Array {
    /**
     *  ordena o conjunto em ordem crescente
     *
     * @memberof NumberSet
     */
    sort() {
        super.sort((a, b) => {
            return a - b;
        })
    }

    /**
     *  adiciona um elemento no conjunto
     *
     * @param {number} number
     * @memberof NumberSet
     */
    add(number) {
        if (this.length === 0) {
            this.push(number);
            return;
        }
        if (this.has(number)) return
        if (number < this[0]) this.unshift(number)
        else {
            for (let i = 1; i < this.length; i++) {
                if (number < this[i]) {
                    this.splice(i, 0, number)
                    return;
                }
            }
            this.push(number)
        }
        return
    }

    add_fromList(array){
        for (let i in array) {
            this.add(array[i])
        }
    }

    /**
     *  remove um elemento do conjunto
     *  
     * @param {number} number
     * @memberof NumberSet
     */
    remove(number) {
        let index = this.indexOf(number)
        if (index >= 0) {
            return this.splice(index, 1)[0]
        }
    }

    /**
     * Verifica se um elemento está no conjunto
     *
     * @param {number} number
     * @returns Index do elemento
     * @memberof NumberSet
     */
    has(number) {
        return this.indexOf(number) >= 0
    }

    /**
     *  Une dois conjuntos
     *  
     * @param {NumberSet} numberset
     * @returns
     * @memberof NumberSet
     */
    union(numberset) {
        let union = new NumberSet();
        for (let i in this) {
            union.add(this[i])
        }
        for (let j in numberset) {
            union.add(numberset[j])
        }
        return union;
    }

    /**
     *  retorna a diferença dos conjuntos
     *
     * @param {NumberSet} numberset
     * @returns
     * @memberof NumberSet
     */
    difference(numberset){
        let dif = new NumberSet();
        for (let i in this) {
            dif.add(this[i])
        }
        for (let j in numberset) {
            dif.remove(numberset[j])
        }
        return dif;
    }

    /**
     *  Interseção entre dois conjuntos
     *
     * @param {NumberSet} numberset
     * @returns
     * @memberof NumberSet
     */
    intersection(numberset){
        let inter = new NumberSet();
        for (let i in this) {
            if(numberset.has(this[i])) inter.add(this[i])
        }
        return inter;
    }

    equals(set){
        if(this.length === set.length){
            for(let i in this){
                if(this[i] !== set[i]) return false;
            }
            return true;
        }
        return false;
    }
}

module.exports = NumberSet