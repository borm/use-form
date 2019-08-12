export type useFieldProps = { type?: any; value?: any };

export type form = {
  fields: any;
  values: any;
  errors: any;
  field: {
    getState: (name: string) => useFieldProps;
    setState: (name: string, state: useFieldProps) => useFieldProps;
  };
  subscribers?: Array<any>;
  subscribe?: (callback: any) => {};
  notify?: () => any;
};