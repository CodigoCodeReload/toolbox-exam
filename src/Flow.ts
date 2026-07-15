class Flow{

    // create singleton instance
    private static instance: Flow;
    
    private constructor() {
        
    }

    public static getInstance(): Flow {
        if (!Flow.instance) {
            Flow.instance = new Flow();
        }
        return Flow.instance;
    }
    
}