declare interface RawMealData {
    name: string;
    cuisine: string;
    ingredients: {
        name: string;
        amount: number;
        unit: string;
    }[];
    steps: string[];
    image: {
        title: string;
        url: string;
        source: string;
        source_url: string;
        width: number;
        height: number;
    };
};

declare type RawMenuData = RawMealData[];