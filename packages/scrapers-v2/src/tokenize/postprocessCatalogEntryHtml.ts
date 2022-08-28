export enum ParseHtmlElementType {
  Main,
  H2,
  H3,
  H5,
  Table,
}

export type ParseHtmlLeafList = CheerioElement[];

export type ParseHtmlMain = {
  type: ParseHtmlElementType.Main;
  leadingLeafList: ParseHtmlLeafList;
  leadingH5s: ParseHtmlH5[];
  leadingH3s: ParseHtmlH3[];
  h2s: ParseHtmlH2[];
};

export type ParseHtmlH2 = {
  type: ParseHtmlElementType.H2;
  header: CheerioElement;
  leadingLeafList: ParseHtmlLeafList;
  h3s: ParseHtmlH3[];
};

export type ParseHtmlH3 = {
  type: ParseHtmlElementType.H3;
  header: CheerioElement;
  leafList: ParseHtmlLeafList;
};

export type ParseHtmlH5 = {
  type: ParseHtmlElementType.H5;
  header: CheerioElement;
  leafList: ParseHtmlLeafList;
};

export const processHtmlMain = (
  leadingLeafList: ParseHtmlLeafList = [],
  leadingH5s: ParseHtmlH5[] = [],
  leadingH3s: ParseHtmlH3[] = [],
  h2s: ParseHtmlH2[] = []
): ParseHtmlMain => {
  return {
    type: ParseHtmlElementType.Main,
    leadingH3s,
    leadingH5s,
    leadingLeafList,
    h2s,
  };
};

export const processHtmlH2 = (
  h2: CheerioElement,
  leadingLeafList: ParseHtmlLeafList = [],
  h3s: ParseHtmlH3[] = []
): ParseHtmlH2 => {
  return {
    type: ParseHtmlElementType.H2,
    header: h2,
    leadingLeafList,
    h3s,
  };
};

export const processHtmlH3 = (
  h3: CheerioElement,
  leafList: ParseHtmlLeafList
): ParseHtmlH3 => {
  return {
    type: ParseHtmlElementType.H3,
    header: h3,
    leafList,
  };
};

export const processHtmlH5 = (
  h5: CheerioElement,
  leafList: ParseHtmlLeafList
): ParseHtmlH5 => {
  return {
    type: ParseHtmlElementType.H5,
    header: h5,
    leafList,
  };
};
