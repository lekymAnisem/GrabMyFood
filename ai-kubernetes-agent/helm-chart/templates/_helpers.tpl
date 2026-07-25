{{- define "ai-agent.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ai-agent.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "ai-agent.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
