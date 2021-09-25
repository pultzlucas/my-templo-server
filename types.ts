export interface Template {
    name: string
    created_at: string
    paths: Array<{
      path: string
      path_type: string
    }>
    contents: Array<{
      file_path: string
      text: string
    }>
    args?: Array<{
      key: string
      query: string
      default: string
    }> | null
  }