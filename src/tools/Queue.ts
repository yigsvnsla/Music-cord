interface config { length: null | number }

export class Queue <T> {

    protected _queue: T[]
    protected _front: number
    protected _rear: number
    private readonly _length: number | null

    /**
     * @param config
     */
    constructor(config: config = { length: null }) {
        this._queue = Array.from({ length: (config.length != null) ? config.length : 0 })
        this._front = 0
        this._rear = 0
        this._length = config.length
    }

    /**
     * Obtener inmutable de la cola
     */    
    public get values() : any[] { return this._queue }
    
    /**
     * Obtener largo de la cola
     */
    public get size(): number | null { return this._length }

    /**
     * agrega (almacena) un elemento a la cola.
     * @parameter data
     */
     public enqueue(data: T) {
        try {
            if (this.isfull()) 
                throw new Error(`<enqueue> Cola llena, intento de desbordamiento \n <value> ${data}`);
            
            this._queue[this._rear] = data
            this._rear += 1
            
        } catch (error) {
            console.log(error);
            return 0
        }
    }

    /**
     * eliminar (acceder) un elemento de la cola.
     */
    public dequeue() {
        try {
            if (this.isempty()) 
                throw new Error(`<enqueue> Cola Vacia, intento de subDesbordamiento`);
            
            // falta actualizar el tamaño en this._lenght
            const data = this._queue[this._front]
            delete this._queue[this._front]
            this._front += 1
            return data

        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * obtiene el elemento al principio de la cola sin eliminarlo.
     * 
     * `Esta función ayuda a ver los datos al principio de la cola.`
     */
    public get peek(): T { return this._queue[this._front] }

    /**
     * comprueba si la cola está llena.
     */
    public isfull(): boolean {
        if (this._length == null) return false;
        if (this._length != null) return (this._rear == this._length);
        return false
    }

    /**
     * comprueba si la cola está vacía.
     */
    public isempty(): boolean { return ((this._rear <= 0)) }

}


// const x = new Queue()
// x.enqueue('dasasas')
// x.enqueue('dasasas')
// x.enqueue('dasasas')
// x.dequeue()
// console.log(x.values);
// console.log('empty',x.isempty());
// console.log(x);
