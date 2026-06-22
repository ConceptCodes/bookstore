export type ToolPartLike = {
  type: string;
  toolName?: string;
  toolCallId?: string;
  input?: unknown;
  output?: unknown;
  state?: string;
  errorText?: string;
  toolMetadata?: {
    eve?: {
      inputRequest?: InputRequest;
    };
  };
};

export type InputRequest = {
  requestId: string;
  prompt?: string;
  description?: string;
  options?: InputRequestOption[];
};

export type InputRequestOption = {
  optionId: string;
  label?: string;
  description?: string;
};

export type ToolCardProps<TInput = unknown, TOutput = unknown> = {
  input: TInput;
  output: TOutput;
  toolCallId?: string;
};

export type ToolCardDispatchProps = {
  part: ToolPartLike;
  onRespond?: (requestId: string, optionId: string) => void;
};
