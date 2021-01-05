export default function getDimensionCutoff(): {
    mobile: {
        min: number;
        max: number;
    };
    tablet: {
        min: number;
        max: number;
    };
    desktop: {
        min: number;
        max: number;
    };
    television: {
        min: number;
        max: number;
    };
    } {
    return {
        mobile: {
            min: 320,
            max: 480,
        },
        tablet: {
            min: 481,
            max: 768,
        },
        desktop: {
            min: 1025,
            max: 1200,
        },
        television: {
            min: 1201,
            max: Infinity,
        },
    };
}
