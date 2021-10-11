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

export interface About {
  author: string,
  version: string,
  description: string,
  requiresAccessKey: boolean,
}

export interface GetTemplateResponse {
  extra: {
    message: string,
    is_error: boolean
  }
  template?: string
}