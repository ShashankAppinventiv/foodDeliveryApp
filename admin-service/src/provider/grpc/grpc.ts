import { loadPackageDefinition } from "@grpc/grpc-js";
import { PackageDefinition, loadSync } from "@grpc/proto-loader";
import { Observable, Subscriber } from "rxjs";
import path from "path";
export class GRPC {
  protected package!: any;
  constructor(protoFileName: string, packageName: string) {
    this.loadProtoFile(protoFileName, packageName);
  }
  protected loadProtoFile(protoFileName: string, packageName: string) {
    const packageDef: PackageDefinition = loadSync(
      path.resolve(__dirname, `${process.cwd()}/src/proto/${protoFileName}`)
    );
    const grpcObject = loadPackageDefinition(packageDef);
    this.package = grpcObject[packageName];
  }
  protected invokeService<Type>(service: any, method: string, payload: Type) {
    try {
      return new Observable((subscriber: any) => {
        service[method](payload, (err: Error, res: any) => {
          if (err) {
            subscriber.error(err);
          } else {
            subscriber.next(res);
          }
        });
      });
    } catch (err) {
        console.log(err)
      throw err;
    }
  }
}
