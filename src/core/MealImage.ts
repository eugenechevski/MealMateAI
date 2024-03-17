export class MealImage {
  /**
   * @param title The title of the image
   */
  title: string;

  /**
   * @param url The URL of the image
   */
  url?: string;

  /**
   * @param width The width of the image
   */
  width?: number;

  /**
   * @param height The height of the image
   */
  height?: number;

  /**
   * @param source The source of the image
   */
  source?: string;

  /**
   * @param source_url? The URL of the source
   */
  source_url?: string;

  constructor(
    title: string,
    url?: string,
    width?: number,
    height?: number,
    source?: string,
    source_url?: string
  ) {
    this.title = title;
    this.url = url;
    this.width = width;
    this.height = height;
    this.source = source;
    this.source_url = source_url;
  }
}
