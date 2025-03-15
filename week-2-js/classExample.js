class Ship{
    constructor(length, capacity, captainExp) {
        this.length = length;
        this.capacity = capacity;
        this.captainExp = captainExp;
    }

    value() {
        return this.length*this.capacity*this.captainExp;
    }

    details() {
        console.log(`Ship details: length: ${this.length}m, capacity: ${this.capacity}L`)
    }
}

class RescueBoat extends Ship{
    constructor(rescueCapacity) {
        this.rescueCapacity = rescueCapacity;
    }

    value(){
        return this.rescueCapacity;
    }
}

let ship1 = new Ship(10,100,3);

console.log(ship1.value());
ship1.details();