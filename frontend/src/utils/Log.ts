class Log {
    static debug(...args: any[]) {
        if (process.env.NODE_ENV === "development") {
            console.debug("%c[DEBUG]", "color: #2196F3; font-weight: bold;", ...args);
        }
    }

    static info(...args: any[]) {
        if (process.env.NODE_ENV === "development") {
            console.info("%c[INFO]", "color: #4CAF50; font-weight: bold;", ...args);
        }
    }

    static warn(...args: any[]) {
        console.warn("%c[WARN]", "color: #FF9800; font-weight: bold;", ...args);
    }

    static error(...args: any[]) {
        if (typeof window === "undefined") 
            console.error(...args);
        else {
            if (process.env.NODE_ENV === "development") {
                args.forEach((arg) => {
                    if (arg instanceof Error) console.error(arg);
                    else console.warn("%c[CLIENT ERROR]", "color: #f44336; font-weight: bold;", arg);
                });
            }

        }
    }
}

export default Log;
