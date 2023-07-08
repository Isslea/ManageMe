import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private url: string = "https://manageme-4d1e1-default-rtdb.europe-west1.firebasedatabase.app/"

  constructor(private http: HttpClient) { }

  sendForm<T>(formData: T, filename: string) {
    return this.http
      .post<{ name: string }>(
        `${this.url}/${filename}.json`,
        formData
      );
  }

  updateForm<T>(updatedData: T, filename: string, id: string) {
    return this.http.put(
      `${this.url}/${filename}/${id}.json`,
      updatedData
    );
  }

  updatePartial<T>(updatedData: Partial<T>, filename: string, id: string) {
    return this.http.patch(
      `${this.url}/${filename}/${id}.json`,
      updatedData
    );
  }



  getAll<T>(filename: string) {
    return this.http
      .get<{ [key: string]: T }>(
        `${this.url}/${filename}.json`,
      )
      .pipe(
        map(responseData => {
          const postsArray: T[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }

  getById<T>(filename: string, id: string) {
    return this.http
      .get<T>(
        `${this.url}/${filename}/${id}.json`
      )
      .pipe(
        map(fetchedData => ({ ...fetchedData, id }))
      );
  }

  deleteRelated(filename: string, idsToDelete: string[]) {
    return forkJoin(idsToDelete.map(id => {
      return this.http.delete(`${this.url}/${filename}/${id}.json`);
    }));
  }


  deleteById(filename: string, id: string, name: string) {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmed) {
      return this.http
        .delete(`${this.url}/${filename}/${id}.json`)
    }
    return null
  }

}
