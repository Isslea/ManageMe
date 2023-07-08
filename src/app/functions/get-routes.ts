import {ActivatedRoute} from "@angular/router";

export function extractRouteParams(route: ActivatedRoute): { projectId: string, epicId?: string, taskId?: string, edit?: boolean } {
  const projectId = route.snapshot.paramMap.get('project')!;
  const epicId = route.snapshot.paramMap.get('epic')!;
  const taskId = route.snapshot.paramMap.get('task')!;
  const edit = route.snapshot.routeConfig?.path?.includes('edit')!
  return { projectId, epicId, taskId, edit };
}
