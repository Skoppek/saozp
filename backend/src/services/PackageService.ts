import PackageRepository from '../repository/PackageRepository';
import {
    CreatePackageBody,
    UpdatePackageBody,
} from '../bodies/problemPackageRequests';
import {
    PackageCreationFailureError,
    PackageNotFoundError,
} from '../errors/packageErrors';

export default class PackageService {
    private packageRepository = new PackageRepository();

    async createPackage({ name }: CreatePackageBody, ownerId: number) {
        const newPackage = await this.packageRepository.createPackage({
            name,
            owner: ownerId,
        });

        if (!newPackage) {
            throw new PackageCreationFailureError();
        }
    }
    async getPackageList() {
        return await this.packageRepository.getPackageList();
    }

    async getPackage(packageId: number) {
        const bundle = await this.packageRepository.getPackage(packageId);

        if (!bundle) {
            throw new PackageNotFoundError(packageId);
        }

        const problems =
            await this.packageRepository.getProblemsOfPackage(packageId);

        return {
            ...bundle,
            problems,
        };
    }

    async updatePackage(data: UpdatePackageBody, packageId: number) {
        const updatedBundle = this.packageRepository.updateProblemPackage(
            packageId,
            data,
        );

        if (!updatedBundle) {
            throw new PackageNotFoundError(packageId);
        }
    }

    async deletePackage(packageId: number) {
        await this.packageRepository.deleteProblemPackage(packageId);
    }

    async addProblemsToPackage(packageId: number, problemIds: number[]) {
        if (!(await this.packageRepository.getPackage(packageId))) {
            throw new PackageNotFoundError(packageId);
        }

        await Promise.all(
            problemIds.map((id) =>
                this.packageRepository.addProblemToPackage(packageId, id),
            ),
        );
    }

    async removeProblemsFromPackage(packageId: number, problemIds: number[]) {
        if (!(await this.packageRepository.getPackage(packageId))) {
            throw new PackageNotFoundError(packageId);
        }

        await Promise.all(
            problemIds.map((id) =>
                this.packageRepository.removeProblemFromPackage(packageId, id),
            ),
        );
    }
}
